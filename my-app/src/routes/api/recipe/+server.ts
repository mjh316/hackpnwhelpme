import { openai } from '$lib/util/chatgpt';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    //console.log(request);
    const json = await request.json();
    const _ingredients = json.ingredients;
    const _culture = json.culture;
    let base_prompt_1 = "Ingredients I have: ";
    for (const ingredient of _ingredients) {
        base_prompt_1 += "-" + ingredient;
    }
    const main_prompt = base_prompt_1 + `Give me a random but fully developed idea seeded by ${Math.random()} for a balanced ` + _culture + "-style meal I can make. Give a very accurate, lengthy and thorough recipe that reflects the meal's culture. When outputting your response write the name of the meal in the first line, then add two new lines. Then list the ingredients in a new line in the format \nIngredients:\nFettucine\nSpinach 2\netc.\n (include measurements for ingredients in the same line after their name). \nThen add two more new lines and write the steps in a new line"
    console.log(main_prompt);
    let _response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: main_prompt,
        temperature: 0,
        max_tokens: 1000,
    }).then(response => response.data.choices[0].text);
    const lines = _response!.split("\n\n");
    const name = lines[1];
    const ingredients = lines[2].split("\n").slice(1);
    const instructions = lines[3].split("\n").slice(0);

    console.log('instructions', instructions);
    console.log('BRUH', _response);
    return new Response(JSON.stringify({
        name,
        ingredients,
        steps: instructions
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}) satisfies RequestHandler;