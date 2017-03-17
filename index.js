// Import the native MongoDB driver
const Mongo = require('mongodb')
// Import Winston for async logging
const Winston = require('winston')

// The MongoClient class provides an interface for connecting to a MondoDB database
const MongoClient = Mongo.MongoClient

// Url of your MongoDB database. Substitute with your own
const dbURI = 'mongodb://satrom:secret@percy.mongo.xervo.io:27017/qY6rexaj'


// Call the client comment method and provide a callback to report connection results
MongoClient.connect(dbURI, (err, db) => {
  // If the connection failed, report the error and return
  if (err) return Winston.error(`Unable to connect to server: ${err}`)

  // The connection worked, let's log that too
  Winston.info(`Connected to MongoDB database at ${dbURI}`)

  // Get (or create) the thr users collection
  const users = db.collection('users')

  // create some users
  var userList = [
    { name: 'Leah', age: 32, roles: ['admin', 'moderator', 'user'], supersuer: false },
    { name: 'Jason', age: 26, roles: ['user'] },
    { name: 'Kim', age: 24, roles: ['moderator', 'user'] }
  ]

  // Add those users to our collection and provide a callback to report the result
  users.insertMany(userList, (err, result) => {
    // If the insert failed, report the error and return
    if (err) return Winston.error(`Unable to insert users: ${err}`)

    Winston.info(`Inserted ${result.insertedCount} documents into 'users' collection: ${result.insertedIds}`)

    users.updateOne({name: 'Leah'}, {$set: { superuser: true }}, (err, result) => {
      if (err) return Winston.error(`Unable to update users: ${err}`)

      if (result) {
        Winston.info(`Successfully updated document`)
      } else {
        Winston.error('No users updated!')
      }

      /* users.find({ name: 'Leah' }).toArray((err, result) => {
        if (err) return Winston.error(`Unable to find users: ${err}`)

        if (result.length) {
          Winston.info(`Found: ${result.length}`)
        } else {
          Winston.error('No users found!')
        }

        // When we're done, make sure to close the connection
        db.close()
      }) */

      // Find called by itself returns a cursor
      const userCursor = users.find({ name: 'Leah' })
      // sort by record age, descending
      userCursor.sort({ age: -1 })
      // limit to 10 records
      userCursor.limit(10)

      userCursor.forEach((user) => Winston.info(`User: ${JSON.stringify(user)}`))

      // When we're done, make sure to close the connection
      db.close()
    })
  })
})
