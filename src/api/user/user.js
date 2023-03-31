const config = require("../../../config");
const { db } = require("../../modules/DBConnection");

async function workers(req, res, next) {
  try {
    if (req.user[0].role_fk == 1) {
      db.query(
        `SELECT role_fk,idUser,name,surname FROM user`,
        (err, result, fields) => {
          console.log(result);
          if (result.length === 0) return res.status(401).json({ message: `No token found` });
          return res.status(200).json(result);
        }
      );
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
}

async function addFolder(req, res, next) {
  const folderName = `${req.body.folder}`;
  try {
    db.query(
      `INSERT INTO folder (name, assigned_worker_id) VALUES (?,?)`,
      [folderName, req.body.idUser],
      (err, result, fields) => {
        const TableID = result.insertId;
        if (req.files) {
          for (const file in req.files) {
            console.log(`${file} : ${req.files[file].name}`);
            db.query(
              "INSERT INTO file (name, bufferData, type,folder_fk) VALUES (?,?,?,?)",
              [
                req.files[file].name,
                req.files[file].data,
                req.files[file].mimetype,
                TableID,
              ]
            );
          }
          return res
            .status(200)
            .json({ message: `${Object.keys(req.files).length} files added` });
        }
        return res
          .status(200)
          .json({ message: `folder '${folderName}' created` });
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
}

async function userFolder(req, res, next) {
  try {

	db.query(`SELECT idFolder, name, assigned_worker_id FROM folder WHERE assigned_worker_id = '${req.params.Uid}' `, 
	(err, result, fields) =>{
		console.log(result[0]);
	  if (err) throw err;
	  res.json(result)
	})
	
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
}

async function getFolderContent(req, res, next) {

db.query(`SELECT f.name as folder_name, f.assigned_worker_id, 
	fi.idFile, fi.name as file_name, fi.bufferData as file_data, fi.type as file_type, fi.folder_fk
  FROM folder f
  LEFT JOIN file fi ON f.idFolder = fi.folder_fk
  WHERE f.assigned_worker_id = '${req.params.Uid}' AND f.idFolder = '${req.params.FolderContent}'
  `, 
   (err, result, fields) =>{
	if (err) throw err;
  
	//check sometimes this line gives you error
  console.log(result)
   res.json(result)
  
	});


}

module.exports = {
  workers,
  addFolder,
  userFolder,
  getFolderContent,
};
