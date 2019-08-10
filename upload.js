const fs = require('fs')
const csvWriter = require('csv-write-stream')
const csv = require('csv-parser')
var writer = csvWriter()
var finalPathFile = 'file.csv';
function savedata(){
    var id = document.getElementById('id').value;
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var status = true;
    if(id!=''&&name!=''&&age!=''){
        fs.createReadStream('file.csv')  
            .pipe(csv())
            .on('data', (row) => {
                if(row['id'] == id){
                    status = false;    
                }
            }).on('end',()=>{
                if(status){
                    if (!fs.existsSync(finalPathFile))
                    writer = csvWriter({ headers: ["id", "names","age"]});
                else
                    writer = csvWriter({sendHeaders: false});
                    writer.pipe(fs.createWriteStream(finalPathFile, {flags: 'a'}));
                    writer.write({
                        header1: id,
                        header2: name,
                        header3: age,
                    });
                    writer.end();
                    alert('data inserted successfully');
                    window.location = "index.html";
                }else{
                    document.getElementById('errorindicator').innerHTML = 'already existed id, please choose another one';
                }
            });
        
    }else{
        document.getElementById('errorindicator').innerHTML = 'enter proper data';
    }
}  