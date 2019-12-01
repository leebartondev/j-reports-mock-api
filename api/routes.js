const fs = require('fs')
const path = require('path')

const TEST_ERROR = false

const getFakeDatabase = () => {
  return JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../database/data.json')
  ))
}

const getUserIndexById = (database, id) => {
  // Get index of object by id
  for (let i = 0; i < database.users.data.length; i++) {
    if (Number(database.users.data[i].id) === Number(id)) {
      return i
    }
  }
}

// Get fake datasource data
const getUserData = body => {
  return {
    data: {
      resultMD: [
        { colName: 'ID', colType: 'INTEGER', colNum: 1, colAlias: null, colMod: false },
        { colName: 'Description', colType: 'VARCHAR', colNum: 2, colAlias: null, colMod: false },
        { colName: 'Cost', colType: 'DECIMAL', colNum: 3, colAlias: null, colMod: false }
      ],
      resultSet: [
        { Description: 'chair', ID: 1, Cost: 50.09 },
        { Description: 'shirt', ID: 2, Cost: 16.99 },
        { Description: 'candy', ID: 2, Cost: 5.56 }
      ]
    }
  }
}

module.exports = app => {

  /// /////////////////
  // G E T
  /// /////////////////

  // GET all datasources
  app.get('/rest/users',
    (req, res) => {
      // Get fake data - datasources
      let fakeDatabase = getFakeDatabase()
      // Send fake data
      if (TEST_ERROR) {
        setTimeout(() => res.status(404).send('Not Found'), 2000)
      } else {
        setTimeout(() => res.status(200).send(fakeDatabase.users), 1500)
      }
  })

  /// /////////////////
  // P O S T
  /// /////////////////

  // POST a datasource
  app.post('/rest/users',
    (req, res) => {
      // Get data to add to
      let fakeDatabase = getFakeDatabase()
      let id = 1
      if (fakeDatabase.users.data.length > 0) {
        id = fakeDatabase.users.data[fakeDatabase.users.data.length - 1].id + 1
      }
      // Create datasource object
      let userObject = {
        id: id,
        username: req.body.username,
        groups: req.body.groups,
        permission: req.body.permission
      }
      // Write to mock database
      fakeDatabase.users.data.push(userObject)
      fs.writeFile(
        path.resolve(__dirname, '../database/data.json'),
        JSON.stringify(fakeDatabase),
        (err) => {
          if (err) {
            res.status(500).send('Error writing to database')
          } else {
            if (TEST_ERROR) {
              res.status(404).send('Not Found')
            } else {
              res.status(200).send(JSON.stringify({data: userObject}))
            }
          }
        }
      )
  })

    // POST report template
    app.post('/rest/reports/template',
    (req, res) => {
      let userData = getUserData(req.body)
      // Get fake data - run query
      if (TEST_ERROR) {
        setTimeout(() => res.status(404).send('Not Found'), 2000)
      } else {
        setTimeout(() => res.status(200).send(userData), 1500)
      }
    })

  /// /////////////////
  // P U T
  /// /////////////////

  // Update a datasource
  app.put('/rest/users/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getUserIndexById(fakeDatabase, id)
      // update object
      fakeDatabase.users.data[index].username = req.body.username ? req.body.username : fakeDatabase.users.data[index].username
      fakeDatabase.users.data[index].groups = req.body.groups ? req.body.groups : fakeDatabase.users.data[index].groups
      fakeDatabase.users.data[index].permission = req.body.permission ? req.body.permission : fakeDatabase.users.data[index].permission
      // Write to database
      fs.writeFile(
        path.resolve(__dirname, '../database/data.json'),
        JSON.stringify(fakeDatabase),
        (err) => {
          if (err) {
            res.status(500).send('Error writing to database')
          } else {
            if (TEST_ERROR) {
              res.status(404).send('Not Found')
            } else {
              res.status(200).send(JSON.stringify({data: fakeDatabase.users.data[index]}))
            }
          }
        }
      )
    })

  /// /////////////////
  // D E L E T E
  /// /////////////////

  // Delete a datasource
  app.delete('/rest/users/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getUserIndexById(fakeDatabase, id)
      // Filter array by id
      let filteredData = fakeDatabase.users.data.filter(
        (user) => {
          return Number(user.id) !== Number(id)
      })
      // Set new data set
      fakeDatabase.users.data = filteredData
      // Write to database
      fs.writeFile(
        path.resolve(__dirname, '../database/data.json'),
        JSON.stringify(fakeDatabase),
        err => {
          if (err) {
            res.status(500).send('Error writing to database')
          } else {
            if (TEST_ERROR) {
              res.status(404).send('Not Found')
            } else {
              res.status(200).send(JSON.stringify({data: { message: "User deleted" }}))
            }
          }
        }
      )
    })
}