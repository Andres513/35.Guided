const express = require('express')
const app = express();

const { 
    client,
    createTables,
    createUser,
    createSkill,
    fetchUsers,
    fetchSkills,
    createUserSkills,
    fetchUserSkills,
    deleteUserSkills
} = require('./db')

app.use(express.json())

app.get('/api/users', async(req,res,next)=>{
     try { 
        res.send(await fetchUsers())

    } catch(error) {
        next(error)
    }
})
app.get('/api/skills', async(req,res,next)=>{
    try{
        res.send(await fetchSkills())
    } catch(error) {
        next(error)
    }
})
app.get('/api/users/:id/user_skills', async(req,res,next)=>{
    try {
        res.send(await fetchUserSkills(req.params.id))
    } catch(error) {
        next(error)
    }
})
app.post('/api/users/:user_id/user_skills', async(req,res,next)=>{
    try {
        res.status(201).send(await createUserSkills({user_id: req.params.user_id, skill_id: req.body.skill_id}))
    } catch(error) {
        next(error)
    }
})
app.delete('/api/users/:user_id/user_skills/:id', async(req,res,next)=>{
    try {
        res.send(await deleteUserSkills({user_id: req.params.user_id, id: req.params.id}))
        res.sendStatus(204)
    } catch(error) {
        next(error)
    }
})
const init = async() => {
    await client.connect()
    console.log("connected to database")
    await createTables()
    console.log("tables created")
    const [andres, emily, david, jane, guitar, painting, climbing, running ] = await Promise.all([
        createUser({username: 'andres', password: 'secret1'}),
        createUser({username: 'emily', password: 'secret2'}),
        createUser({username: 'david', password: 'secret3'}),
        createUser({username: 'jane', password: 'secret4'}),
        createSkill({name: 'guitar'}),
        createSkill({name: 'painting'}),
        createSkill({name: 'climbing'}),
        createSkill({name: 'running'})
    ])    
    // console.log(`andres has an id of ${andres.id}`)
    // console.log(`guitar has an id of ${guitar.id}`)

    console.log('List of users:', await fetchUsers())
    console.log('List of skills', await fetchSkills())
    

    await Promise.all([
        createUserSkills({user_id: andres.id, skill_id: guitar.id}),
        createUserSkills({user_id: emily.id, skill_id: painting.id}),
        createUserSkills({user_id: david.id, skill_id: climbing.id}),
        createUserSkills({user_id: jane.id, skill_id: running.id})
    ])
    // console.log(await fetchUserSkills(andres.id))
    // console.log(await fetchUserSkills(emily.id))
    
    const userSkillsAndres = await fetchUserSkills(andres.id);
    const userSkillsEmily = await fetchUserSkills(emily.id);
    const userSkillsDavid = await fetchUserSkills(david.id)
    console.log('before deleting:',  {userSkillsAndres, userSkillsEmily, userSkillsDavid})
    await deleteUserSkills({ user_id: andres.id, id: userSkillsAndres[0].id});
    console.log('after deleting => userSkillAndres:', await fetchUserSkills(andres.id));
    console.log('userSkillEmily:', await fetchUserSkills(emily.id));
    console.log('userSkillDavid:', await fetchUserSkills(david.id));
   
    console.log(`(GET userSkills)Copy and paste in postman for testing => localhost:3000/api/users/${david.id}/user_skills`);
    console.log(`(Copy and Paste to POST): CURL -X POST localhost:3000/api/users/${david.id}/user_skills -d '{"skill_id":"${running.id}"}' -H 'Content-Type:application/json'`);
    console.log(`(Copy and Paste to DELETE): CURL -X DELETE localhost:3000/api/users/${david.id}/userSkills/${userSkillsDavid[0].id}`);
    const port = process.env.PORT || 3000
    app.listen(port, ()=>console.log(`listening on port ${port}`))


}

init()