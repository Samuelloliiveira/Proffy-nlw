module.exports = async function(db, {proffyValue, classValue, classScheduleValues}) {
    //Inserir dados nas suas respectivas tabelas
    const insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}",
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}"
        )
    `)

    const proffy_id = insertedProffy.lastID
    //--------------------------------------//
    const insertedClass = await db.run(`
            INSERT INTO classes (
                subject,
                cost,
                proffy_id
            ) VALUES (
                "${classValue.subject}",
                "${classValue.cost}",
                "${proffy_id}"
            )
    `)

    const class_id = insertedClass.lastID
    //-------------------------------------//
    //Aqui fazemos uma repetição através do map()
    //por que não sabemos quantos dias horários e dia
    //será inserido pelo proffy. O map() retorna valor
    const insertedAllClassScheduleValues = classScheduleValues.map((classScheduleValue) => {
        return db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                "${class_id}",
                "${classScheduleValue.weekday}",
                "${classScheduleValue.time_from}",
                "${classScheduleValue.time_to}"
            )
        `)
    })
    
    //Aqui executa todos os db.runs() da class_schedules
    await Promise.all(insertedAllClassScheduleValues)
}