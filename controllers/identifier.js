const BirdSighting = require('../models/bird');
const SparqlClient = require('sparql-client-2');
const endpointUrl = 'http://dbpedia.org/sparql';
const fetch = require('node-fetch');

async function fetchBirdURI(location, description) {
    const [latitude, longitude] = location.split(",");
    const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?name ?description ?dbpediaLink
    WHERE {
      ?bird a dbo:Bird ;
        rdfs:label ?name ;
        dbo:abstract ?description ;
        foaf:depiction ?image ;
        dbo:wikiPageExternalLink ?dbpediaLink .
      FILTER(regex(?name, "${description}", "i"))
      FILTER(langMatches(lang(?description), "en"))
     
    }
    LIMIT 1`;
    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;
    console.log('111',url)
    try {
        const response = await fetch(url);
        const data = await response.json();
        const result = data.results.bindings[0];
        if (result) {
            const uri = result.bird.value;
            console.log("chinnu wins", uri);
            return uri;
        }
    } catch (error) {
        console.error("Error fetching bird URI:", error);

        throw new Error("Failed to fetch bird URI");
    }

    return null;
}

module.exports = { fetchBirdURI };
