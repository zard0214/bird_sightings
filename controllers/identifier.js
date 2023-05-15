const BirdSighting = require('../models/bird');
const SparqlClient = require('sparql-client-2');
const endpointUrl = 'http://dbpedia.org/sparql';
// Define function to search for bird species and create new bird sighting document


function saveBirdSighting(req, res) {

    // Get the parameters from the request body or query string
    const { dateTime, description, photo, location } = req.body;
    // Construct SPARQL query to search for bird species
    const birdQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    SELECT ?name ?description ?dbpediaLink
      WHERE {
        ?bird a dbo:Bird ;
              rdfs:label ?name ;
              dbo:abstract ?description ;
              foaf:depiction ?image ;
              dbo:wikiPageExternalLink ?dbpediaLink .
        FILTER(regex(?name, "${description}", "i"))
        FILTER(langMatches(lang(?description), "en"))
        FILTER(regex(?image, "${photo}", "i"))
        FILTER(?lat - ${location.coordinates[0]} < 0.01 && ${location.coordinates[0]} - ?lat < 0.01)
        FILTER(?long - ${location.coordinates[1]} < 0.01 && ${location.coordinates[1]} - ?long < 0.01)
      }
      LIMIT 1
  `;


    // Execute SPARQL query
    const client = new SparqlClient(endpointUrl);
    client.query(birdQuery).execute((error, results) => {
        if (error) {
            // Handle error
            console.error(error);
            throw new Error('An error occurred');
        } else {
            const species = results.results.bindings[0].species.value;
            const commonName = results.results.bindings[0].commonName.value;
            const scientificName = results.results.bindings[0].scientificName.value;

            // Create new bird sighting document and save to database
            const birdSighting = new BirdSighting({
                dateTime: dateTime,
                description: description,
                photo: photo,
                location: {
                    type: 'Point',
                    coordinates: [location.coordinates[1], location.coordinates[0]]
                },
                species: species,
                commonName: commonName,
                scientificName: scientificName
            });
            birdSighting.save()
                .then(() => {
                    console.log('Bird sighting saved to database');
                })
                .catch((error) => {
                    console.error(error);
                    throw new Error('An error occurred');
                });
        }
    });
    res.send(birdQuery);
}
module.exports = {
    saveBirdSighting
};