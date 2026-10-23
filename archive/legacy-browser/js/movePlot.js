const userName = localStorage.getItem("username"); // saved to session
const nextPlotPointBtn = $("#plotNextBtn");

//contains all dialogue text blocks in order
const plotArr = [
    {
        textBlock1: `It was with hardened hearts that your family bid you farewell. “Take care, ${userName}. Be safe.”`,
        textBlock2: `The smoky haze of the morning sun illuminates the forest floor before you. With a deep breath, you see a clear path. Your hometown has been ravaged by an invisible enemy, a power which emanates from the belly of a crowned dragon. You had said your goodbyes and left for battle, but each step away from your home filled your chest with growing dread and anxiety.`,
        textBlock3: `As you walk, the snapping of foliage awakens the inhabitants of this uncharted territory. You feel a low rumbling beneath your feet as you start to run away from its perpetrator.`,
        textBlock4: `The loud buzzing is followed by the heavy thump of a large body bumping into you, knocking you off your feet. As you raise your gaze from the forest floor, you see-`
    },
    {
        textBlock1: `You raise your fist, victorious as the giant hornet lay lifeless before you. Testing fate, you come closer to it, kicking it to it’s back with your foot.`,
        textBlock2: `You find a dissipating glow coming from its torso, your suspicions that it was connected to the crowned dragon proven correct. With a heavy heart, you realize that the power coming from its cursed gem was stronger than you originally thought. Your hometown had been spared so far because of its distance from the beast, but who’s to say it won’t come closer?`,
        textBlock3: `With growing resilience, you stand tall before your former enemy and turn your back to it, walking towards the mouth of Cave Covid. With the sky darkening to dusk, you hear a fluttering of wings coming from the roof of the cave.`,
        textBlock4: `Before you can raise your eyes to the source, a large creature lands before you. With horror, you see-`
    },
    {
        textBlock1: `Your body is weary from exhaustion, but you feel a spring in your step as the monster bat collapses and falls to the precipice of the cave. Its limp body crashes into the walls of the cave and lands with a loud thud to its floor - you know with certainty it will never stand again.`,
        textBlock2: `With resolution, you turn and head to the deepest part of the cave. The walls are dark, and you place your hand against its rugged face to feel your way deeper and deeper down its path. The trickling of water is the only sound echoing the cave other than your labored breathing.`,
        textBlock3: `From the distance, you see a dim light growing brighter with each step you take. You know what it is. It’s too late to turn back now. The cave is getting warmer and warmer as the light turns an iridescent shade of yellow and blue.`,
        textBlock4: `Around the corner, the huge shape of the crowned dragon - Corona, greets you with its magnificent form. You lock eyes and get into an attack position.`
    }
];

const forestImg = '/images/plot1Bkg.png';
const caveImg = '/images/plot2Bkg.png';
const deeperCaveImg = '/images/plot3Bkg.png';

let pathImg = '';

//bee for forest
//bat for cave
//dragon for deeper cave

let currentPath = $("#plotNextBtn").attr("level");
let pathIndex = 0;

switch(currentPath) {
    case "forest": 
        pathIndex = 0;
        pathImg = forestImg;
        break;
    case "cave":
        pathIndex = 1;
        pathImg = caveImg;
        break;
    case "deeper cave":
        pathIndex = 2;
        pathImg = deeperCaveImg;
}

let textBlockNum = 1;
let textBlock = 'textBlock'+textBlockNum;

nextText(textBlockNum, textBlock);

textBlockNum++;
textBlock = 'textBlock'+textBlockNum; 

//show image for plot
$('img.plot-bg').attr("src", pathImg);

nextPlotPointBtn.on("click", (event) => {

    console.log(`text block - ${textBlock}`);
    console.log(`text block number - ${textBlockNum}`);

    event.preventDefault();

    nextText(textBlockNum, textBlock);

    textBlockNum++;
    textBlock = 'textBlock'+textBlockNum; 

});

function nextText(textBlockNum, textBlock) {

    if(textBlockNum < 4) {

        //show next block of text
        $('#plottext').text(plotArr[pathIndex][textBlock]);

    } else if(textBlockNum == 4) {

        //redirects to battle screen for path
        window.location = "/battle/"+pathId+"/"+currentPath;

    }

}