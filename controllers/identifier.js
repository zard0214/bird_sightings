const BirdSighting = require('../models/bird');
const SparqlClient = require('sparql-client-2');
const endpointUrl = 'http://dbpedia.org/sparql';
const fetch = require('node-fetch');
// Define function to search for bird species and create new bird sighting document

async function fetchBirdURI(identification) {

    const sparqlQuery = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?link
    WHERE {
    <http://dbpedia.org/resource/${identification}> foaf:isPrimaryTopicOf ?link.
    }
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