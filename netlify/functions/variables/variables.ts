import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
   
    const myimportantVariable = process.env.MY_IMPORTANT_VARIABLE;

    if(!myimportantVariable) {
        throw 'Missing MY_IMPORTANT_VARIABLE'
    }
    console.log('Hola mundo desde los logs de netlify functions')
   
    return {
        statusCode: 200,
        body: JSON.stringify({myimportantVariable }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}

export { handler }