const fetch = require('node-fetch');
const Bird = require('./models/bird');


// Retrieve the details of the bird sighting from the MongoDB database
Bird.findById(birdId)
    .then(bird => {
        // Use the bird sighting details to construct a SPARQL query
        const sparqlQuery = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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
      LIMIT 1`;

        // Make an HTTP request to the DBpedia endpoint with the SPARQL query
        fetch(`http://dbpedia.org/sparql?query=${encodeURIComponent(sparqlQuery)}`, {
                headers: { 'Accept': 'application/sparql-results+json' }
            })
            .then(response => response.json())
            .then(data => {
                // Extract the name and DBpedia link of the matching bird species
                const name = data.results.bindings[0].name.value;
                const dbpediaLink = data.results.bindings[0].dbpediaLink.value;

                // Display the bird species name and link on the HTML page
                const birdNameInput = document.getElementsByClassName('form-group_name');
                birdNameInput.value = name;

                const dbpediaLinkElement = document.getElementsByClassName('form-group_link');
                dbpediaLinkElement.href = dbpediaLink;
                dbpediaLinkElement.textContent = dbpediaLink;
            })
            .catch(error => {
                // Handle errors
            });
    }).catch(err => {
        // Handle errors
    });