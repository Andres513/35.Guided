const { 
    client,
    createTables,
    createUser,
    createSkill,
    fetchUsers,
    fetchSkills,
    createUserSkills,
    fetchUserSkills,
    deleteUserSkill
} = require('./db')

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
    

    const userSkills = await Promise.all([
        createUserSkills({user_id: andres.id, skill_id: guitar.id}),
        createUserSkills({user_id: emily.id, skill_id: painting.id}),
        createUserSkills({user_id: david.id, skill_id: climbing.id}),
        createUserSkills({user_id: jane.id, skill_id: running.id}),
    ])
    // console.log(await fetchUserSkills(andres.id))
    // console.log(await fetchUserSkills(emily.id))
    
    console.log('Skill of Andres:', await fetchUserSkills(andres.id));
    await deleteUserSkill({ user_id: andres.id, id: userSkills[0].id});
    console.log(await fetchUserSkills(andres.id)); 
}

init()