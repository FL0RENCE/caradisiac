//I ONLY DID COMMENTS

// importation de la librairie express, permettant de faire la connexion du port
var express = require('express');

//minimap des différentes routes de l'app
var router = express.Router();

//instance de l'api
var carapi = require('node-car-api')

//libraire pour utiliser elasticsearch
var elastic = require('../elasticsearch');

//fonction qui ne bloque pas le déroulement de l'app puisque asynchrone
var gather = async function () {

//la table elakstic est indexée
  elastic.createIndex()

  try {
  
  //on attend la promesse de l'obtention des brands. On devrait obtenir une liste des marques
    brands = await carapi.getBrands()
    
    //liste des modèles
    var j = []
    
    for(let i in brands) {
    
      console.log(brands[i])
      
      /liste des modèles de la marque
      m = await carapi.getModels(brands[i])
      
      //on met chaque modèle dans chaque marque. dans la table elastic
      elastic.put('brand', m)
      
      j.push(m)
    }
    
    console.log(j)

  }catch(ex) {
  
    console.log("err "+ex)
    
    return ex
  }

    return j

}

router.get('/', function (req, res, next) {

//construction du json
  gather().then((a) => {
    res.json(a)
  })

});

module.exports = router;
