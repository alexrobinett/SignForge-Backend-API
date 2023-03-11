const User = require('../models/userModel')
const Message = require('../models/imageModel')
const Player = require('../models/playerModel')
const asyncHandler = require('express-async-handler')

// Get all Players With Owner
const getAllPlayers = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const players = await Player.find().lean()

    // If no players
    if (!players?.length) {
        return res.status(400).json({ message: 'No Players found' })
    }

    const PlayersWithOwner = await Promise.all(players.map(async (player) => {
        const user = await User.findById(player.user).lean().exec()
        return {...player, userName: user.userName }
    }))

    res.json(PlayersWithOwner)
})

// get a player by it's ID

const getPlayerById = asyncHandler(async (req, res, next) => {
    try {
      const playerId = req.params.id;
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
    const { owner, playerName, playlist } = req.body;

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
    } else {
        return res.status(400).json({ message: 'Invalid Player data received' });
    }
});

// update player
const updatePlayer = asyncHandler(async (req, res) => {
    const { id, owner, playlist, playerName, deleteMessageId, newMessage } = req.body

    // Confirm data
    if (!id || !playerName) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm Player exists to update
    const player = await Player.findById(id).exec()

    if (!player) {
        return res.status(400).json({ message: 'Player not found' })
    }

    // Check for duplicate Player Name
    const duplicate = await Player.findOne({ playerName }).lean().exec()

    // Allow renaming of the original Player
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Player Name' })
    }

    // Delete message from playlist
    if (deleteMessageId) {
        player.playlist = player.playlist.filter(message => message.id !== deleteMessageId)
    }

    // Push new message to playlist
    if (newMessage) {
        player.playlist.push(newMessage)
    }

    player.owner = owner
    player.playerName = playerName

    const updatedPlayer = await player.save()

    res.json(`'${updatePlayer.playerName}' updated`)
})

// delete player
const deletePlayer = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Player ID required' })
    }

    // Confirm Player exists to delete 
    const player = await Player.findById(id).exec()

    if (!player) {
        return res.status(400).json({ message: 'Player not found' })
    }

    const result = await player.deleteOne()

    const reply = `Player '${result.playerName}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
   deletePlayer,
   updatePlayer,
   createNewPlayer,
   getAllPlayers,
   getPlayerById
}