const messages = {
    EnrolPatient:{
        id:"EnrolPatient",
        title:"Blood Pressure Monitoring",
        subtitle:"You have been enroled by your G.P. to monitor your Blood Pressure.",
        notificationText: "You have been enroled by your G.P. to monitor your Blood Pressure. Please open the message details to hear more.",
        text:'You have been enroled by your G.P. to monitor your Blood Pressure. For this purpose I will remind you everyday in the morning and evening to take the measurement. I will guide you each time to take the measurement correctly.',
        actions:[{actionLabel: 'More Info', actionType:'readText'}]
    },

    MeasureBP:{
        id:"MeasureBP",
        title:"Blood Pressure Measurement",
        subtitle:"It is time to take you blood pressure measurement",
        notificationText: "It is time to take you blood pressure measurement",
        actions:[{actionLabel: 'Start Now', actionType:'bot', botName: 'MeasureBP', botTriggerText:'Take a measurement.', process:true}]
    },

    TakeDrug:{
        id:"TakeDrug",
        title:"Your medicine",
        subtitle:"It is time to take the medicine",
        notificationText: "It is time to take the medicine according to the prescription schedule",
        text: 'Have you taken your medicine this morning? You need to take 1 point 25 milligrams of Ramipril. Please confirm by tapping the Confirm button.',
        actions:[{actionLabel:"More Info", actionType:"readText"}, {actionLabel:"Confirm", actionType:"acknowledge"}]
    },

    EnrolPatientForTreatment:{
        id:"EnrolPatientForTreatment",
        title:"Hypertension Treatment",
        subtitle:"You have been enroled by your G.P. for hypertension treatment.",
        notificationText:"You have been enroled by your G.P. for hypertension treatment.",
        text:'You have been enroled by your G.P. for hypertension treatment.  For this purpose I will remind you to take the medicine according to the prescription schedule and I will remind and guide you to take periodically the blood pressure measurement to assess the progress of the treatment.',
        actions:[{actionLabel:"More Info", actionType:"readText"}]
    }
}

export default messages;