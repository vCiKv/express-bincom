require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testDbConnection } = require('./db');

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors()); 
app.use(express.json());

testDbConnection();

app.get('/api/get-pu', async (_req, res) => {
  try {
    const [pu_details] = await pool.query('SELECT uniqueid,polling_unit_name,polling_unit_number FROM polling_unit WHERE polling_unit_name != ""');
    if(pu_details){
      res.json(pu_details); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/api/get-pu/:puid', async (req, res) => {
  try {
    const pollingUnitId = Number(req.params.puid);
    if(isNaN(pollingUnitId) || pollingUnitId <= 0 || !pollingUnitId){
      res.status(400).json({message:"Bad Request"})
    }
    const [results_details] = await pool.execute(`SELECT polling_unit_uniqueid,party_abbreviation,party_score,entered_by_user FROM announced_pu_results WHERE polling_unit_uniqueid = ?  ORDER BY party_score DESC;`,
      [pollingUnitId]
    );

    if(results_details){
      res.json(results_details); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/api/get-lga-results', async (_req, res) => {
  try {
    const [lga_results] = await pool.query(`
    SELECT
      APR.polling_unit_uniqueid,
      APR.party_abbreviation,
      APR.party_score,
      APR.result_id,
      PU.polling_unit_name,
      PU.lga_id,
      LGA.lga_name
    FROM
      announced_pu_results AS APR
    LEFT JOIN
      polling_unit AS PU ON APR.polling_unit_uniqueid = PU.uniqueid
    LEFT JOIN
      lga AS LGA ON LGA.lga_id = PU.uniqueid
    ORDER BY  
      APR.party_score DESC;
    `);
    if(lga_results){
      const lgaList = new Set()
      for(const result of lga_results){
        if(result.lga_name && result.lga_name !== ""){
          lgaList.add(result.lga_name)
        }
      }
      res.json({results:lga_results,lgaName:[...lgaList]}); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/api/get-lga-results/:stateId', async (req, res) => {
  try {
    const stateId = parseInt(req.params.stateId);
    if(stateId <= 0){
      res.status(400).json({message:"Bad Request"})
    }
    const [lga_results] = await pool.execute(`
    SELECT
      APR.polling_unit_uniqueid,
      APR.party_abbreviation,
      APR.party_score,
      APR.result_id,
      PU.polling_unit_name,
      PU.lga_id,
      LGA.lga_name
    FROM
      announced_pu_results AS APR
    LEFT JOIN
      polling_unit AS PU ON APR.polling_unit_uniqueid = PU.uniqueid
    LEFT JOIN
      lga AS LGA ON LGA.lga_id = PU.uniqueid
    WHERE LGA.state_id = ?
    ORDER BY  
      APR.party_score DESC;
    `,
    [stateId]
    );
    if(lga_results){
      const lgaList = new Set()
      for(const result of lga_results){
        if(result.lga_name && result.lga_name !== ""){
          lgaList.add(result.lga_name)
        }
      }
      res.json({results:lga_results,lgaName:[...lgaList]}); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/api/get-parties', async (_req, res) => {
  try {
    const [party_details] = await pool.query('SELECT partyname FROM party');
    if(party_details){
      res.json(party_details); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/api/get-states', async (_req, res) => {
  try {
    const [party_details] = await pool.query('SELECT state_id,state_name FROM states');
    if(party_details){
      res.json(party_details); 
    }else{
      res.status(504).json({ message: 'Gateway Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.post('/api/add-pu-result', async (req, res) => {
  const { pollingUnitId, party,user,partyScore  } = req.body; // Extract name and email from the request body
  if (!pollingUnitId || !party || !user|| !partyScore) {
    return res.status(400).json({ message: 'Invalid Request' });
  }
  const votes = parseInt(partyScore)
  if(isNaN(votes) || user==="" || party ==="" || pollingUnitId===""){
    return res.status(400).json({ message: 'Invalid Request' });
  }
  const date = new Date()
  const ip = req.ip
  try {
      console.log("data",[pollingUnitId, party,votes,user,date,ip])
      await pool.execute(
          'INSERT INTO `announced_pu_results`(`polling_unit_uniqueid`, `party_abbreviation`, `party_score`, `entered_by_user`, `date_entered`, `user_ip_address`) VALUES (?,?,?,?,?,?)',
          [pollingUnitId, party,votes,user,date,ip]
      );
      res.status(201).json({
          message: 'User created successfully!',
      });

  } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

