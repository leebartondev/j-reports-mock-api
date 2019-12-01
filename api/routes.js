const fs = require('fs')
const path = require('path')

const TEST_ERROR = false

const getFakeDatabase = () => {
  return JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../database/data.json')
  ))
}

const getDatasourceIndexById = (database, id) => {
  // Get index of datasource by id
  for (let i = 0; i < database.datasources.data.length; i++) {
    if (Number(database.datasources.data[i].id) === Number(id)) {
      return i
    }
  }
}

const getReportIndexById = (database, id) => {
  // Get index of report by id
  for (let i = 0; i < database.reports.data.length; i++) {
    if (Number(database.reports.data[i].report_id) === Number(id)) {
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

  // GET all reports
  app.get('/rest/reports',
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

  // POST create a report
  app.post('/rest/reports',
  (req, res) => {
    let fakeDatabase = getFakeDatabase()
    let id = (fakeDatabase.reports.data.length > 0) ? fakeDatabase.reports.data[fakeDatabase.reports.data.length - 1].report_id + 1 : 1
    // Create datasource object
    let reportObject = {
      report_id: id,
      datasource_id: req.body.datasource_id,
      query_string: req.body.query_string,
      report_title: req.body.report_title,
      report_desc: req.body.report_desc,
      resultMD: req.body.resultMD
    }
    fakeDatabase.reports.data.push(reportObject)
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
            res.status(200).send(JSON.stringify({data: reportObject}))
          }
        }
      }
    )
  })

  // POST run a report
  app.post('/rest/reports/run',
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

  // Update a report
  app.put('/rest/reports/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Get index of report by id
      let index = getReportIndexById(fakeDatabase, id)
      // Update object
      fakeDatabase.reports.data[index].report_title = req.body.report_title ? req.body.report_title : fakeDatabase.reports.data[index].report_title
      fakeDatabase.reports.data[index].report_desc = req.body.report_desc ? req.body.report_desc : fakeDatabase.reports.data[index].report_desc
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
              res.status(200).send(JSON.stringify({data: fakeDatabase.reports.data[index]}))
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

  // Delete a report
  app.delete('/rest/reports/:id',
    (req, res) => {
      // Get param
      let id = req.params.id
      // Get database
      let fakeDatabase = getFakeDatabase()
      // Filter array by id
      let filteredData = fakeDatabase.reports.data.filter(
        (report) => {
          return Number(report.report_id) !== Number(id)
        }
      )
      // Set new data set
      fakeDatabase.reports.data = filteredData
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