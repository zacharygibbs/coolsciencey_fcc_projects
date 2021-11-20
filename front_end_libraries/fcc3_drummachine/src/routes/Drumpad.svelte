<script>

import Drumbutton from './DrumButton.svelte'
export let mounted
export let key

let playing_sound = [];
let button_clicked = [];
let id = [];
let drumButtonNames = [['Q', 'W', 'E'], ['A', 'S', 'D'], ['Z', 'X', 'C']];

let idSounds = {'Sound 1': 'mixkit-orchestral-violin-jingle-2280.wav',
            'Sound 2': 'mixkit-orchestra-happy-fast-jingle-696.wav',
            'Sound 3': 'mixkit-chord-swell-short-692.wav',
            'Sound 4': 'mixkit-western-guitar-drum-single-2333.wav',
            'Sound 5': 'mixkit-short-guitar-riff-2322.wav',
            'Sound 6': 'mixkit-negative-guitar-tone-2324.wav', 
            'Sound 7': 'mixkit-cool-guitar-riff-2321.wav',
            'Sound 8': 'mixkit-guitar-notification-alert-2320.wav',
            'Sound 9': 'mixkit-happy-guitar-chords-2319.wav' };

let drumSounds = [];
let drumWavs = [];
for(let i=0;i<3;i++){
    drumSounds.push([]);
    drumWavs.push([]);
    for(let j=0;j<3;j++){
        drumSounds[i].push("Sound " + (1 + i*3 + j))
        drumWavs[i].push(idSounds["Sound " + (1 + i*3 + j)])
    }
}

const handlePlaying = (event) => {
    if(!(playing_sound.includes(event.detail.wav))){
        playing_sound = [...playing_sound, event.detail.wav]
        id = [...id, event.detail.id]
        button_clicked = [...button_clicked, event.detail.button]
    }
}

const handleEnded = (event) => {
    playing_sound = playing_sound.filter(item => item !== event.detail.wav)
    id = id.filter(item => item !== event.detail.id)
    button_clicked = button_clicked.filter(item => item !== event.detail.button)
}

console.log(drumSounds)
</script>

<tr id='table'>
    <td id="column1">
        <div id="drum-machine">
            {#each drumButtonNames as drumButtonName, i}
                <Drumbutton value={drumButtonName}
                            ids={drumSounds[i]}
                            idSounds={idSounds}
                            key={key}
                            mounted={mounted}
                            on:playing={handlePlaying}
                            on:ended={handleEnded} />
            {/each}
        </div>
    </td>
    <td id="column2">
        <div id="display">
            <b> Decently cool drum machine </b> <br/>
            Button Clicked: {button_clicked} <br/>
            Wav File: {playing_sound}<br/>
            Sound ID: {id}<br/><br/><br/><br/><br/>
            
            <a href="https://mixkit.co/free-sound-effects/music/">Sounds from mixkit.co</a>
        </div>
    </td>
    
</tr>

<style>

    #column1 {
            /*float:left;*/
            margin:0;
            border: 2px solid black;
    }
    #column2 {
            padding-left: 10px;
            padding-top: 0px;
            width: 300px;
            background-color: rgba(176, 217, 230, 0.418);
            border: 2px solid black;

    }

</style>