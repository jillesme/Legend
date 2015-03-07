var sql = {};

// Fetches the current legend, old legend and time
sql.getLegend = 'SELECT current, previous, since ' +
             'FROM legend ' + 
             'WHERE id = ' + 
             '(SELECT MAX(id) FROM legend)';

// Fetches the last legend name
sql.getLastLegend = 'SELECT current ' +
                    'FROM legend ' +
                    'WHERE id = ' +
                    '(SELECT MAX(id) FROM legend)';

// Inserts the new legend
sql.setLegend = 'INSERT INTO legend ' +
                '(current, previous, since) ' +
                'VALUES ' +
                '(\'[legend]\',\'[previous]\',\'[since]\')';

module.exports = sql;
