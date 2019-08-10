const csv = require('csv-parser');  
const fs = require('fs');

function showdata(){
    var rowData = "";
    fs.createReadStream('file.csv')  
        .pipe(csv())
        .on('data', (row) => {
            rowData= rowData+"<tr id='"+row['id']+"'><td>"+row['id']+"</td><td>"+row['name']+"</td><td>"+row['age']+"</td><td><button class='"+row['id']+"' onclick='deleterow(this)'>Delete</button><button class='"+row['id']+"' onclick='edit(this)'>Edit</button></td></tr>";
        }).on('end', ()=>{
            document.getElementById('table-body').innerHTML = rowData;
        });
    }
    showdata();


function searchdata(){
    var search = document.getElementById('data-for-search').value;
    var rowcounter = 0;
    var sorteddata='';
    if(search){
        fs.createReadStream('file.csv')  
            .pipe(csv())
            .on('data', (row) => {
                if((row['id'].includes(search))||(row['name'].includes(search))||(row['age'].includes(search))){
                    sorteddata+= "<tr id='"+row['id']+"'><td>"+row['id']+"</td><td>"+row['name']+"</td><td>"+row['age']+"</td><td><button class='"+row['id']+"' onclick='deleterow(this)'>Delete</button><button class='"+row['id']+"' onclick='edit(this)'>Edit</button></td></tr>";
                    rowcounter++;
                }
            }).on('end',()=>{
                if(rowcounter == 0){
                    document.getElementById('table-body').innerHTML = "<tr><td>No Records Found</td><td></td><td></td><td></td></tr>";
                }
                else{
                    document.getElementById('table-body').innerHTML = sorteddata;
                }
            });
    }else{
        showdata();
    }
}

function edit(row){
    fs.createReadStream('file.csv')  
        .pipe(csv())
        .on('data', (rowdata) => {
            if(rowdata['id'] == row.className){
                document.getElementById(row.className).innerHTML="<td>"+row.className+"</td><td><input type='text' value='"+rowdata['name']+"' id='name'></td><td><input type='text' value='"+rowdata['age']+"' id='age'></td><td><button id='"+row.className+"' onclick='editing(this)'>Update</button></td>";
            }
        });
}
        
function editing(row){
    var name=document.getElementById('name').value;
    var age=document.getElementById('age').value;
    if(name!=''&&age!=''){
        var idToSearchFor = row.id;
        fs.readFile('file.csv', 'utf8', function(err, data)
        {
            if (err)
            {
                // check and handle err
            }
                
            let linesExceptFirst = data.split('\n');
                
            let linesArr = linesExceptFirst.map(line=>line.split(','));
            linesArr.forEach(row => {
                if(row[0] === idToSearchFor){
                    row[1] = name;
                    row[2] = age;
                }
            });
            let output = linesArr.join("\n");
            fs.writeFileSync('file.csv', output);
        });
        
        alert('profile of '+row.id+' updated successfully ');
        window.location = "index.html";
    }else{
        alert('enter proper data');
        window.location = "index.html";
    }
}

function deleterow(row){
    var idToSearchFor = row.className;
    fs.readFile('file.csv', 'utf8', function(err, data)
    {
        if (err)
        {
            // check and handle err
        }
        let linesExceptFirst = data.split('\n');
        let linesArr = linesExceptFirst.map(line=>line.split(','));
                
        let output = linesArr.filter(line=>(line[0]) !== idToSearchFor).join("\n");
        fs.writeFileSync('file.csv', output);
    });
    alert('row deleted successfully');
    window.location = "index.html";
}