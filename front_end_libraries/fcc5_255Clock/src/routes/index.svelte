<svelte:head>
    <title>FCCProject5: 25 and 5 Timer</title>
  </svelte:head>
<script>
    import IconButton from '../../node_modules/@smui/icon-button/dist/IconButton.svelte'
    import ConfigTimer from './ConfigTimer.svelte';
    import TimerDisplay from './TimerDisplay.svelte';
    let breakTime0 = 5;
    let sessionTime0 = 25;
    let breakTime;
    let sessionTime;
    let counting = false;
    let timeleft = sessionTime;
    let timeleft_seconds = 0;
    let start_stop = 'play_arrow';
    let timerID = 0;
    let reset_counting = true;
    let mode = 'Session';
    $: {
        if(!counting & reset_counting){
            reset_all()
        }
        else{
            start_stop = 'pause';
            reset_counting = false;
            clearInterval(timerID);
            timerID = setInterval(loopcount, 1000);
        }
    }
    $: {
        if(!counting){
            start_stop = 'play_arrow';
            clearInterval(timerID);
        }
        //clearInterval(timerID);
    }
    
    const loopcount = () => {
        
        if(timeleft==0 & timeleft_seconds==0){
            mode = mode=='Session' ? 'Break' : 'Session';
            timeleft = mode=='Session' ? sessionTime : breakTime;
            timeleft_seconds = 0;
            document.getElementById('beep').play()
        }
        else if(timeleft_seconds==0){
            timeleft_seconds = 59;
            timeleft--
        }
        else{
            timeleft_seconds--
        }
    }


    const do_reset_counting = () => {
        counting = false;
        reset_counting = true;
        let el = document.getElementById('beep');
        console.log(el);
        el.pause();
        el.currentTime = 0;
        reset_all();
    }

    const reset_all = () => {
        start_stop = 'play_arrow';
        sessionTime = sessionTime0 * 1.0;
        breakTime = breakTime0 * 1.0;
        mode = 'Session';
        timeleft = mode=='Session' ? sessionTime : breakTime;
        timeleft_seconds = 0;
    }
    
    const handleChange = (event) => {
        if(event.detail.id == 'session'){
            sessionTime = event.detail.value
            if(mode == 'Session' 
                 & timeleft != sessionTime){
                timeleft = sessionTime;
                timeleft_seconds = 0;
            }
        }
        else{
            breakTime = event.detail.value
            if(mode == 'Break' 
                 & timeleft != breakTime){
                timeleft = breakTime;
                timeleft_seconds = 0;
            }
        }

    }    

</script>

<head>

    <!-- Bootstrap -->
    <!-- <link href="bootstrap.min.css" rel="stylesheet"/> -->

    
    <!-- Code for SMUI https://sveltematerialui.com/SVELTEKIT.md -->
    <!-- Material Icons -->
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <!-- Roboto -->
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
    />
    <!-- Roboto Mono -->
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono"
    />

    <link rel="stylesheet" href="bare.css" />    

</head>



<main>
	<h1> Free Code Camp - Front End Development Libraries </h1>
	<h2>Project 5 - 25 and 5 Clock</h2>
	<div id="box">
	  <div class="panel panel-primary">
		<div class="panel-heading">25 and 5 Clock</div>
        <table>
            <tr>
                <td>
                    <ConfigTimer value={breakTime} counting={counting} labeltext="Break Length" id="break" on:change={handleChange} />
                </td>
                <td>
                    <ConfigTimer value={sessionTime} counting={counting} labeltext="Session Length" id="session" on:change={handleChange}/>
                </td>
            </tr>
            <tr>
                <td colspan=2>
                    <TimerDisplay mode={mode} timeleft={timeleft} timeleft_seconds={timeleft_seconds}/>
                    <br/>
                    <div id="play-pause-reset">
                        <IconButton class="material-icons" id="start_stop" on:click={() => {counting = !counting}}>{start_stop}</IconButton>
                        <IconButton class="material-icons" id="reset" on:click={do_reset_counting}>restart_alt</IconButton>
                        <audio id='beep' src='mixkit-alarm-digital-clock-beep-989.wav'></audio>
                    </div>
                </td>
            </tr>
	  </div>
	</div>
	


</main>



<style lang="scss">
	$color: black;
	h1 {
	  color: $color;
	}

	#box {
	  background: gainsboro;
	  border: 4px solid black;
      float: left;
      margin-top: 5%;
      margin-left: 25%;
	  width: 50%;
	  max-width: 400px;
	}

	.panel-heading {
		font-size: large;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		color: blue;
		font-style: oblique;
        margin-left: 10px;
	}
    
	table {
		margin-top: 10px;
        width: 100%;
        align-items: center;
	}
    td {
        text-align: center
    }

    #play-pause-reset {
        margin-top: -20px;
    }

  </style>
  

