import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"


const notify = async(message: string) => {
    
        const body = {content: message}

        const resp = await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'

            }
        })

        if(!resp.ok){
            console.log(`Discord webhook error: ${resp.statusText}`)
            return false;
        }

        return true
    

}


const onStart =  (payload: any) : string => {
    let message: string;    

    const {action, sender, repository, starred_at} = payload

    
    return  `User ${sender.login} ${action} star on ${repository.full_name}`
     
}

const onIssue=  (payload: any) : string => {
     
    const {action, issue} = payload

    if(action === 'opened'){
        const message =   `An issue was opened with title ${issue.title}`
        console.log(message)
        return message
    }


    if(action === 'closed'){
        const message =   `An issue was closed by ${issue.user.login}`
        console.log(message)
        return message
    }
     
    
    
    if(action === 'reopened'){
        const message =   `An issue was reopened by ${issue.user.login}`
        console.log(message)
        return message
    }


    return  `Unhandled action for the issue event ${action}`
     
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {

    const githubEvent = event.headers['x-github-event'] ?? 'unknown'
    //const signature = req.headers['x-hub-signature-256'] ?? 'unknown'
    const payload = JSON.parse( event.body ?? '{}')
    let message: string
    console.log(payload)
   

    switch (githubEvent) {
        case 'star':
            message =onStart(payload) 
            break;
        case 'issues':
            message =onIssue(payload) 
            break;
        default:
            message = `Unknown event ${githubEvent}`
            break;
    }
    


   await notify(message)
   
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: "Success" 
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}

export { handler }