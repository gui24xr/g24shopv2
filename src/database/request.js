import axios from "axios";

export function testConect(APIToken){

    
const data = JSON.stringify({
    "collection": "products",
    "database": "shopg24",
    "dataSource": "Cluster0",
    "projection": {
        "_id": 1
    }
});

const config = {
    method: 'post',
    url: 'https://sa-east-1.aws.data.mongodb-api.com/app/data-xwlurwz/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'Authorization': `Bearer ${APIToken}` ,
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        return JSON.stringify(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });


}
