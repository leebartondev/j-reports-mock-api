const fs = require('fs')
const path = require('path')

const TEST_ERROR = false

const getFakeDatabase = () => {
  return JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../database/data.json')
  ))
}

const getDatasourceIndexById = (database, id) => {
  // Get index of object by id
  for (let i = 0; i < database.datasources.data.length; i++) {
    if (Number(database.datasources.data[i].id) === Number(id)) {
      return i
    }
  }
}

// Get fake datasource data
const getDatasourceData = body => {
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
  app.get('/rest/datasources',
    (req, res) => {
      // Get fake data - datasources
      let fakeDatabase = getFakeDatabase()
      // Send fake data
      if (TEST_ERROR) {
        setTimeout(() => res.status(404).send('Not Found'), 2000)
      } else {
        setTimeout(() => res.status(200).send(fakeDatabase.datasources), 1500)
      }
  })

  /// /////////////////
  // P O S T
  /// /////////////////

  // POST a datasource
  app.post('/rest/datasources',
    (req, res) => {
      // Get data to add to
      let fakeDatabase = getFakeDatabase()
      let id = 1
      if (fakeDatabase.datasources.data.length > 0) {
        id = fakeDatabase.datasources.data[fakeDatabase.datasources.data.length - 1].id + 1
      }
      // Create datasource object
      let datasourceObject = {
        id: id,
        name: req.body.name,
        connection_string: req.body.connection_string,
        username: req.body.username,
        password: req.body.password
      }
      // Write to mock database
      fakeDatabase.datasources.data.push(datasourceObject)
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
              res.status(200).send(JSON.stringify({data: datasourceObject}))
            }
          }
        }
      )
  })

    // POST report template
    app.post('/rest/reports/template',
    (req, res) => {
      let datasourceData = getDatasourceData(req.body)
      // Get fake data - run query
      if (TEST_ERROR) {
        setTimeout(() => res.status(404).send('Not Found'), 2000)
      } else {
        setTimeout(() => res.status(200).send(datasourceData), 1500)
      }
    })

  /// /////////////////
  // P U T
  /// /////////////////

  // Update a datasource
  app.put('/rest/datasources/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getDatasourceIndexById(fakeDatabase, id)
      // update object
      fakeDatabase.datasources.data[index].name = req.body.name ? req.body.name : fakeDatabase.datasources.data[index].name
      fakeDatabase.datasources.data[index].connection_string = req.body.connection_string ? req.body.connection_string : fakeDatabase.datasources.data[index].connection_string
      fakeDatabase.datasources.data[index].username = req.body.username ? req.body.username : fakeDatabase.datasources.data[index].username
      fakeDatabase.datasources.data[index].password = req.body.password ? req.body.password : fakeDatabase.datasources.data[index].password
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
              res.status(200).send(JSON.stringify({data: fakeDatabase.datasources.data[index]}))
            }
          }
        }
      )
    })

  /// /////////////////
  // D E L E T E
  /// /////////////////

  // Delete a datasource
  app.delete('/rest/datasources/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getDatasourceIndexById(fakeDatabase, id)
      // Filter array by id
      let filteredData = fakeDatabase.datasources.data.filter(
        (datasource) => {
          return Number(datasource.id) !== Number(id)
      })
      // Set new data set
      fakeDatabase.datasources.data = filteredData
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
              res.status(200).send(JSON.stringify({data: { message: "Datasource deleted" }}))
            }
          }
        }
      )
    })
}