const BirdSighting = require('../models/birdSighting');
const SparqlClient = require('sparql-client-2');
const endpointUrl = 'http://dbpedia.org/sparql';

// Handle POST request to search for bird species
exports.searchBirdSpecies = (req, res) => {
    const dateTime = document.getElementById('dateTime').value;
    const description = document.getElementById('description').value;
    const photo = document.getElementById('photo').value;
    const latitude = document.getElementById('location').value;
    const longitude = document.getElementById('longitude').value;


    // Construct SPARQL query to search for bird species
    const query = `
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
        FILTER(regex(?name, "${bird.description}", "i"))
        FILTER(langMatches(lang(?description), "en"))
        FILTER(regex(?image, "${bird.photo}", "i"))
        FILTER(?lat - ${bird.location.coordinates[0]} < 0.01 && ${bird.location.coordinates[0]} - ?lat < 0.01)
        FILTER(?long - ${bird.location.coordinates[1]} < 0.01 && ${bird.location.coordinates[1]} - ?long < 0.01)
      }
      LIMIT 1
    `;

    // Execute SPARQL query
    const client = new SparqlClient(endpointUrl);
    client.query(query).execute((error, results) => {
        if (error) {
            // Handle error
            console.error(error);
            res.status(500).send('An error occurred');
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
                    coordinates: [longitude, latitude]
                },
                species: species,
                commonName: commonName,
                scientificName: scientificName
            });
            birdSighting.save()
                .then(() => {
                    res.redirect('/sightings');
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('An error occurred');
                });
        }
    });
    // Execute the SPARQL query
    store.execute(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            const bindings = results.map(result => ({
                speciesUri: result.speciesUri.value,
                commonName: result.commonName.value
            }));
            console.log(bindings); // prints the results as an array of objects
        }
    });

    // Execute SPARQL query and obtain bird species name
    const birdSpecies = query;

    // Render HTML file with bird species name embedded in placeholder element
    res.render('bird-sighting-form', { birdSpecies });

};