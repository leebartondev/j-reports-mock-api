const fs = require('fs')
const path = require('path')

const TEST_ERROR = false

const API_URI = '/J_Reports/rest'

const getFakeDatabase = () => {
  return JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../database/data.json')
  ))
}

const getDatasourceIndexById = (database, id) => {
  // Get index of datasource by id
  for (let i = 0; i < database.datasources.length; i++) {
    if (Number(database.datasources[i].id) === Number(id)) {
      return i
    }
  }
}

const getReportIndexById = (database, id) => {
  // Get index of report by id
  for (let i = 0; i < database.reports.length; i++) {
    if (Number(database.reports[i].report_id) === Number(id)) {
      return i
    }
  }
}

const getUserIndexById = (database, id) => {
  // Get index of object by id
  for (let i = 0; i < database.users.length; i++) {
    if (Number(database.users[i].id) === Number(id)) {
      return i
    }
  }
}

// Get fake datasource data
const getDatasourceData = body => {
  return {
    data: {
      resultMD: [
        { colName: 'product_id', colNum: 1, colAlias: null },
        { colName: 'product_desc', colNum: 2, colAlias: null },
        { colName: 'product_cost', colNum: 3, colAlias: null }
      ],
      resultSet: [
        { product_desc: 'chair', product_id: 1, product_cost: 50.09 },
        { product_desc: 'shirt', product_id: 2, product_cost: 16.99 },
        { product_desc: 'candy', product_id: 3, product_cost: 5.56 }
      ]
    }
  }
}

module.exports = app => {

  /// /////////////////
  // G E T
  /// /////////////////

  // GET all datasources
  app.get(`${API_URI}/datasources`,
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

  // GET all reports
  app.get(`${API_URI}/reports`,
    (req, res) => {
      // Get fake data - reports
      let fakeDatabase = getFakeDatabase()
      // Send fake data
      if (TEST_ERROR) {
        setTimeout(() => res.status(404).send('Not Found'), 2000)
      } else {
        setTimeout(() => res.status(200).send(fakeDatabase.reports), 1500)
      }
    })

  // GET all users
  app.get(`${API_URI}/users`,
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

  // POST user login
  app.post(`${API_URI}/users/login`,
    (req, res) => {
      // Check existing users
      let authUser = null
      let fakeDatabase = getFakeDatabase()
      let users = fakeDatabase.users
      for (const user of users) {
        if (user.username === req.body.username) {
          authUser = {
            id: user.id,
            user_type_id: user.user_type_id
          }
          break
        }
      }

      if (authUser) {
        // Send fake data
        if (TEST_ERROR) {
          setTimeout(() => res.status(404).send('Not Found'), 2000)
        } else {
          setTimeout(() => res.status(200).send(authUser), 1500)
        }
      } else {
        setTimeout(() => res.status(400).send({ message: 'username and/or password is incorrect'}), 2000)
      }
    })

  // POST a user
  app.post(`${API_URI}/users`,
    (req, res) => {
      // Get data to add to
      let fakeDatabase = getFakeDatabase()
      let id = 1
      if (fakeDatabase.users.length > 0) {
        id = fakeDatabase.users[fakeDatabase.users.length - 1].id + 1
      }
      // Create datasource object
      let userObject = {
        id: id,
        username: req.body.username,
        groups: req.body.groups,
        permission: req.body.permission
      }
      // Write to mock database
      fakeDatabase.users.push(userObject)
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
              res.status(200).send(JSON.stringify(userObject))
            }
          }
        }
      )
  })

  // POST a datasource
  app.post(`${API_URI}/datasources`,
    (req, res) => {
      // Get data to add to
      let fakeDatabase = getFakeDatabase()
      let id = 1
      if (fakeDatabase.datasources.length > 0) {
        id = fakeDatabase.datasources[fakeDatabase.datasources.length - 1].id + 1
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
      fakeDatabase.datasources.push(datasourceObject)
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
              res.status(200).send(JSON.stringify(datasourceObject))
            }
          }
        }
      )
  })

  // POST report template
  app.post(`${API_URI}/reports/template`,
  (req, res) => {
    let datasourceData = getDatasourceData(req.body)
    // Get fake data - run query
    if (TEST_ERROR) {
      setTimeout(() => res.status(404).send('Not Found'), 2000)
    } else {
      setTimeout(() => res.status(200).send(datasourceData), 1500)
    }
  })

  // POST create a report
  app.post(`${API_URI}/reports`,
  (req, res) => {
    let fakeDatabase = getFakeDatabase()
    let id = (fakeDatabase.reports.length > 0) ? fakeDatabase.reports[fakeDatabase.reports.length - 1].report_id + 1 : 1
    let copyMD = [...req.body.resultMD.columnMetadata]
    copyMD.forEach((col, i) => {
      if (col.colAlias === null) {
        col.colAlias = 'null'
      }
    })
    // Create datasource object
    let reportObject = {
      report_id: id,
      datasource_id: req.body.datasource_id,
      query_string: req.body.query_string,
      report_title: req.body.report_title,
      report_desc: req.body.report_desc,
      resultMD: {
        columnMetadata: copyMD
      }
    }
    fakeDatabase.reports.push(reportObject)
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
            res.status(200).send(JSON.stringify(reportObject))
          }
        }
      }
    )
  })

  // POST run a report
  app.post(`${API_URI}/reports/run`,
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

  // Update a user
  app.put(`${API_URI}/users/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getUserIndexById(fakeDatabase, id)
      // update object
      fakeDatabase.users[index].username = req.body.username ? req.body.username : fakeDatabase.users[index].username
      fakeDatabase.users[index].groups = req.body.groups ? req.body.groups : fakeDatabase.users[index].groups
      fakeDatabase.users[index].user_type_id = (req.body.user_type_id >= 0) ? req.body.user_type_id : fakeDatabase.users[index].user_type_id
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
              res.status(200).send(JSON.stringify(fakeDatabase.users[index]))
            }
          }
        }
      )
    })

  // Update a datasource
  app.put(`${API_URI}/datasources/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getDatasourceIndexById(fakeDatabase, id)
      // update object
      fakeDatabase.datasources[index].name = req.body.name ? req.body.name : fakeDatabase.datasources[index].name
      fakeDatabase.datasources[index].connection_string = req.body.connection_string ? req.body.connection_string : fakeDatabase.datasources[index].connection_string
      fakeDatabase.datasources[index].username = req.body.username ? req.body.username : fakeDatabase.datasources[index].username
      fakeDatabase.datasources[index].password = req.body.password ? req.body.password : fakeDatabase.datasources[index].password
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
              res.status(200).send(JSON.stringify(fakeDatabase.datasources[index]))
            }
          }
        }
      )
    })

  // Update a report
  app.put(`${API_URI}/reports/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of report by id
      let index = getReportIndexById(fakeDatabase, id)
      // Update object
      fakeDatabase.reports[index].report_title = req.body.report_title ? req.body.report_title : fakeDatabase.reports[index].report_title
      fakeDatabase.reports[index].report_desc = req.body.report_desc ? req.body.report_desc : fakeDatabase.reports[index].report_desc
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
              res.status(200).send(JSON.stringify(fakeDatabase.reports[index]))
            }
          }
        }
      )
    })

  /// /////////////////
  // D E L E T E
  /// /////////////////

  // Delete a user
  app.delete(`${API_URI}/users/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of object by id
      let index = getUserIndexById(fakeDatabase, id)
      // Filter array by id
      let filteredData = fakeDatabase.users.filter(
        (user) => {
          return Number(user.id) !== Number(id)
      })
      // Set new data set
      fakeDatabase.users = filteredData
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
              res.status(200).send(JSON.stringify({ message: "User deleted" }))
            }
          }
        }
      )
    })

  // Delete a datasource
  app.delete(`${API_URI}/datasources/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Filter array by id
      let filteredData = fakeDatabase.datasources.filter(
        (datasource) => {
          return Number(datasource.id) !== Number(id)
      })
      // Set new data set
      fakeDatabase.datasources = filteredData
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
              res.status(200).send(JSON.stringify({message: "Datasource deleted"}))
            }
          }
        }
      )
    })

  // Delete a report
  app.delete(`${API_URI}/reports/:id`,
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Filter array by id
      let filteredData = fakeDatabase.reports.filter(
        (report) => {
          return Number(report.report_id) !== Number(id)
        }
      )
      // Set new data set
      fakeDatabase.reports = filteredData
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
              res.status(200).send(JSON.stringify({message: "Datasource deleted" }))
            }
          }
        }
      )
    })
}