// ----- Directory -----

const dir = "C:\\Users\\Andre\\Documents\\Programme\\metadata-generator\\trait-rename\\trait-rename\\json"

// ---------------------
const fs = require( 'fs' );
const path = require( 'path' );
const naturalCompare = require("natural-compare-lite");
let metadata = [];

// Make an async function that gets executed immediately
(async ()=> {
    // Our starting point
    try {
        // Get the files_json as an array
        const files_json = await fs.promises.readdir( dir );
        files_json.sort(naturalCompare)
        if (files_json[0] == "_metadata.json") files_json.shift()

        for( let i = 0; i < files_json.length; i++ ) {
            // Get the full paths
            const filePath = path.join( dir, files_json[i] );
            const jsonData= require(filePath);

            fs.readFile(filePath, 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("File read failed:", err)
                    return
                }

                const data = JSON.parse(jsonString)

                for (const trait of data.attributes){
                    trait.value = rename(trait.value)
                }

                metadata.push(data)

                fs.writeFile(dir + '_gen\\' + files_json[i], JSON.stringify(data, null, 4), (err) => {
                    // In case of a error throw err.
                    if (err) throw err;
                })

                if (metadata.length === files_json.length){
                    writeMeta(metadata)
                }

            })

        }



    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }
})();

function rename(value){
    const matches = value.match(/[a-z]*_/g);
    value = value.replace(matches[0], "")
    value = value.replace("_", " ")
    value = value.charAt(0).toUpperCase() + value.slice(1)
    return value
}

function writeMeta(metadata){
    metadata.sort(naturalCompare)
    const stringify = JSON.stringify(metadata, null, 4);
    fs.writeFile(dir + '_gen\\' + '_metadata.json', stringify, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })
}
