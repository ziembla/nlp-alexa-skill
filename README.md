
# "Natural Language" Skill for Alexa (Amazon Echo)

Custom skill, based on the "Minecraft helper" from Amazon.

As for now, the skill can only compute the edit distance between two given words (short phrases), but can be asked for it in several ways.


## sample sentences (with answers)

> why is a raven like a writing desk?
>> well, they are not alike... edit distance between 'raven' and 'writing desk' is 13"

> is a raven like a writing desk?
>> no, they are quite different... edit distance between 'raven' and 'writing desk' is 13

> is sea and seat alike
>> yes, they are alike, because edit distance between 'sea' and 'seat' is 1

> give me the edit distance between words dog and cat
>> edit distance between 'dog' and 'cat' is 6

> give me the edit distance between words dragon and tree
>> edit distance between 'dragon' and 'tree' is 8


> give me the distance between table and kitchen
>> edit distance between 'table' and 'kitchen' is 8

> alexa, ask language about distance between spoon and fork
>> edit distance between 'spoon' and 'fork' is 7

> alexa, ask language what is the edit distance between phrase raven and phrase writing desk
>> edit distance between 'raven' and 'writing desk' is 13

> is cook like cork
>> well, they are quite alike, because edit distance between 'cook' and 'cork' is 2

Some more sample sentences

> alexa, ask language what is the distance between manuscript and printed book

> alexa, ask language about distance from home to school


## basic workflow

1. Recognition of the user's speech (Speech To Text) - done by Echo
2. Intent detection (Natural Language Understanding) - done by Alexa Skill, based on:
    - your definition of intents/slots
    - your corpus of sample sentences
3. Taking the requested action - done by your code/service
4. Preparing text (with optional graphics) response for the user - done by your code/service
5. Reading the response to the user (Text To Speech) - done by Echo


## source layout

- `speechAssets` - directory with schema and corpus files needed for skill definition
- `src` - directory with implementation of the service "doing the work" behind the skill (here: "AWS Lambda" code for Node.js engine)
- `tests` - directory with two test scripts for local testing of the service implementation before deployment (not required by the skill)

If you'd like to modify the code and run your own instance of the skill, look for detailed install instructions in materials referenced below.


## possible next steps

- Verify whether invalid corpus with the same sentences assigned to several intents is detected by Amazon's machinery
- Review and enhance corpus
    - "are" not only "is"
    - "a/the"
- Continue dialogue when only one slot is missing - ask for repetition (interaction redesign)
- Allow custom insetion/deletion/substitution cost (interaction redesign)
- Search wordnet for nearest common meaning between words (**that'd be cool**, especially if enumerating the up-and-down path but would require accesses to external resources)


## references

Here are some materials that can help you get up and running quickly:

* Tutorial on setting up the infrastructure and running sample skill:
[New Alexa Skills Kit Template: Build a Trivia Skill in under an Hour](https://developer.amazon.com/public/community/post/TxDJWS16KUPVKO/New-Alexa-Skills-Kit-Template-Build-a-Trivia-Skill-in-under-an-Hour)
* "First page" of the Alexa Skills Kit handbook: [Getting Started with the Alexa Skills Kit](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide)
* Sources of the sample skill taken as a template:
[Alexa Skill sample "Minecraft helper" (node.js version)](https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/minecraftHelper)


## minutiae

* Can anyone be upset with being billed for 100ms if function call used only 0.3ms (from CloudWatch monitoring)?
>REPORT RequestId: 2a2f1507-ed3b-11e5-852c-ddeda4103a31 **Duration: 0.30 ms Billed Duration: 100 ms** Memory Size: 128 MB Max Memory Used: 9 MB Fe
