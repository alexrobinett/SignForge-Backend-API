const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Message = require('../models/imageModel');
const Player = require('../models/playerModel');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();


// Get all Players With Owner
const getAllPlayers = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]

  const id = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })       
        return decoded.UserInfo.userId }
)
    
    try {
      // Get all players from MongoDB
      const players = await Player.find().lean();
  
      // If no players
      if (!players?.length) {
        return res.status(400).json({ message: 'No Players found' });
      }
  
      // Get the user object for the given userId
      const playerUser = await User.findById(id).lean().exec();
      if (!playerUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Map over the players array and add the userName property for each player
      const PlayersWithOwner = players.map(player => ({
        ...player,
        userName: playerUser.userName
      }));
  
      res.json(PlayersWithOwner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// get a player by it's ID

const getPlayerById = asyncHandler(async (req, res, next) => {
  try {
    const playerId = req.body.id;
    const player = await Player.findById(playerId);

    if (!player) {
      res.status(404).send('Player not found');
    } else {
      res.send(player);
    }
  } catch (error) {
    next(error);
  }
});

const createNewPlayer = asyncHandler(async (req, res) => {
  const { playerName, playlist } = req.body;

  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]

  const owner = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })       
        return decoded.UserInfo.userId }
)

  // Confirm data
  if (!owner || !playerName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate playerName
  const duplicate = await Player.findOne({ playerName }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Player Name' });
  }

  // Create and store the new Player
  const newPlayer = await Player.create({ owner, playerName, playlist });

  // Add the new Player's ID to the user's devices array
  const user = await User.findById(owner);
  user.devices.push(newPlayer._id);
  await user.save();

  if (newPlayer) {
    return res.status(201).json({ message: 'New Player created' });
  }
  return res.status(400).json({ message: 'Invalid Player data received' });
});

const updatePlayer = asyncHandler(async (req, res) => {
  const { playerName, id } = req.body;
  const playerId = req.params.id;

  console.log(playerId);
  console.log(playerName);

  // Confirm data
  if (!playerId || !playerName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Confirm Player exists to update
  const player = await Player.findById(playerId).exec();

  if (!player) {
    return res.status(400).json({ message: 'Player not found' });
  }

  // Check for duplicate Player Name
  const duplicate = await Player.findOne({ playerName }).lean().exec();

  // Allow renaming of the original Player
  if (duplicate && duplicate?._id.toString() !== playerId) {
    return res.status(409).json({ message: 'Duplicate Player Name' });
  }

  player.playerName = playerName;

  const updatedPlayer = await player.save();

  res.json(`'${updatedPlayer.playerName}' updated`);
});


// delete player and messages
const deletePlayer = asyncHandler(async (req, res) => {
    const id  = req.query.id;
    
    // Confirm data
    if (!id) {
      return res.status(400).json({ message: 'Player ID required' });
    }
  
    // Confirm Player exists to delete
    const player = await Player.findById(id).exec();
  
    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }
  
    // Remove player from user's devices array
    const user = await User.findByIdAndUpdate(
      player.owner,
      { $pull: { devices: player._id } },
      { new: true }
    ).exec();
  
    const deleteMessagesResult = await Message.deleteMany({
      playerId: player._id,
    }).exec();
  
    const result = await player.deleteOne();
  
    const reply = `Player '${player.playerName}' with ID ${result._id} deleted.`;
  
    res.status(204).json({ message: 'Deleted player successfully' });
  });

const getPlayerPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.query;
    console.log(id)
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Player ID required' });
  }

  // Confirm Player exists to delete
  const player = await Player.findById(id).populate('playlist').exec()

  if (!player) {
    return res.status(400).json({ message: 'Player not found' });
  }


  res.json(player.playlist);
});


module.exports = {
  deletePlayer,
  updatePlayer,
  createNewPlayer,
  getAllPlayers,
  getPlayerById,
  getPlayerPlaylist,
};
