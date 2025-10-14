import Table from "./Table"; 
import Form from "./Form";
import React, {useState, useEffect} from 'react';


function MyApp() {
    const [characters, setCharacters] = useState([]);
    
    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
        });
        return promise;
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }
    function removeOneCharacter(index){
        let id = characters[index]["_id"];
        let link = "Http://localhost:8000/users/" + id;
        const promise = fetch(link, {method: "DELETE"});
        promise.then((res) => {
            if(res.status === 200){
                //if delete was successful, update the characters list
                setCharacters(characters.filter((character, i) => {
                    return i !== index;
                }));
            }
            else{
                throw new Error(`Failed to delete user with status ${res.status}`);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function updateList(person){
        postUser(person)
        .then((res) => {
            if(res.status === 201){
                return res.json();
                //Makes promise return the created user
            }
            else{
                throw new Error(`Failed to add user with status ${res.status}`);
            }
        })
        //promise now returns created user
        .then((createdUser) => {
            setCharacters([...characters, createdUser])
        })
        //if promise is rejected, log the error
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    return (
        <div className = "container">
            <Table 
                characterData = {characters} 
                removeCharacter= {removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}
//Allows for use in other files
export default MyApp;
