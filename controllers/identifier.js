const BirdSighting = require('../models/bird');
const SparqlClient = require('sparql-client-2');
const endpointUrl = 'http://dbpedia.org/sparql';
const fetch = require('node-fetch');
// Define function to search for bird species and create new bird sighting document

async function fetchBirdURI(location, description) {
    const [latitude, longitude] = location.split(",");
    const sparqlQuery = `
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
  FILTER(?lat - ${latitude} < 0.01 && ${latitude} - ?lat < 0.01)
  FILTER(?long - ${longitude} < 0.01 && ${longitude} - ?long < 0.01)
}
LIMIT 1
  `;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const result = data.results.bindings[0];
        if (result) {
            const uri = result.bird.value;
            console.log("chinnu wins", uri)
            return uri;

        }
    } catch (error) {
        console.error("Error fetching bird URI:", error);
    }

    return null;
}


module.exports = { fetchBirdURI };