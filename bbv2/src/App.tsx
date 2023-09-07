import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import './App.css';
import SnowAnimation from './SnowAnimation';
//battle theme
import ti from './assets/sound/ost/Twilight Imperium.wav';
import ab from './assets/sound/ost/Abyssal Lunacy.wav';
//title theme
import tt from './assets/sound/ost/Forboding.wav';
import wind from './assets/sound/sfx/Wind.mp3';
import victory_ost from './assets/sound/ost/victory.wav';
import wind2 from './assets/sound/sfx/wind2.wav';
import UpdateStats from './StatManagement';
import StartMenu from './StartMenu';
import MainPage from './MainPage';
import * as sm from './StatManagement';
import Story from './Story';
import EncyclopediaPage from './EnPage';
import { Randomizer } from './PlayerActions';
import { NameCharacters } from './Naming';
import YouDied from './YouDied';
import VictoryScreen from './victory';
import { PrecipTypeContext } from './Context';
import { set } from 'animejs';



const App: React.FC = () => {

  const [isMusicOn, setIsMusicOn] = useState(false);
  const [battleOst, setBattleOst] = useState(new Audio(ti));
  const [titleOst, setTitleOst] = useState(new Audio(tt));
  const [phase3ost, setPhase3Ost] = useState(new Audio(ab));
  const [victoryOst, setVictoryOst] = useState(new Audio(victory_ost));
  const [currentTrack, setCurrentTrack] = useState("title");
  const [isSnowOn, setIsSnowOn] = useState(true);

  const { precipType, setPrecipType } = useContext(PrecipTypeContext)


  const VolButton: React.FC = () => {
    return (
      <>
        <button onClick={HandleMusicOnOff}>
          {isMusicOn ? <img
            src={require('./assets/images/icons/volume-on.png')}
            alt='music on'
            className='w-10 vol-icon ml-4'></img> :
            <img src={require('./assets/images/icons/volume-off.png')}
              alt='music off'
              className='w-10 vol-icon ml-4'></img>
          }
        </button>
      </>
    )
  }

  const SnowOnOff: React.FC = () => {

    return (
      <section className='snow-switch-container'>

        <h4 className='text-slate-300 font-bold mb-4'>Precipitation</h4>


        <label className="snow-switch">


          <input type="checkbox" id="snow-switch" checked={isSnowOn}
            onChange={() => { setIsSnowOn(!isSnowOn) }
            } />
          <span className="slider round"></span>
        </label>
      </section>
    );
  };

  function TrackControls(current_track: HTMLAudioElement, prev_tracks: HTMLAudioElement[]) { //prev is the ones that need to be muted

    prev_tracks.forEach((track => {
      track.pause();
      track.currentTime = 0;

    }))

    current_track.play();
    current_track.loop = true;



  }
  const all_osts: HTMLAudioElement[] = [battleOst, titleOst, phase3ost, victoryOst];
  const location = useLocation();
  const [url, setUrl] = useState(location);

  useEffect(() => {
    setUrl(location); // Update the URL whenever the location changes
  }, [location]);

  useEffect(() => {

    console.log("url", url)

    if (isMusicOn) {
      if (url.pathname === "/Victory") {
        TrackControls(victoryOst, [battleOst, titleOst, phase3ost]);
      } else {
        switch (currentTrack) {
          case "battle":
            TrackControls(battleOst, [titleOst]);
            break;
          case "title":
            TrackControls(titleOst, [battleOst]);
            break;
          case "phase3":
            TrackControls(phase3ost, [battleOst, titleOst]);
            break;
        }

      }

    } else {
      all_osts.forEach((track => {
        track.pause()
      }))
    }
  }, [isMusicOn, currentTrack, url]);
  //mute for phase 3
  function HandleMusicOnOff(): void {
    setIsMusicOn(!isMusicOn);
  }
  //start with false state, to render the start menu
  const [isGameStarted, setIsGameStarted] = useState(false);



  const navigate = useNavigate();

  function startGame() {
    setIsGameStarted(true);
    setCurrentTrack("battle");
    navigate('/Game');
  }
  function HandleBackToTitle() {
    setIsGameStarted(!isGameStarted);
    if (!isGameStarted) {
      setCurrentTrack("title");
    }
    navigate('/');
  }
  const [bossStage, setBossStage] = useState(1)

  useEffect(() => {
    if (bossStage === 3) {
      setCurrentTrack("phase3")
    }
  }, [bossStage])

  /*At program start, the ternary returns false 
  and renders the start menu. Trigger the callback when clicked,
  which flips the state to true, and renders the main page*/
  return (
    <>
      <Routes>
        <Route path='/'
          element={
            <StartMenu
              on_start={startGame}
              bossStage={bossStage}
            />
          }
        />
        <Route
          path='/Game'
          element={
            <MainPage
              onBackToTitle={HandleBackToTitle}
              bossStage={bossStage}
              setBossStage={setBossStage}
            />
          }
        />
        <Route
          path='/Story'
          element={
            <Story />
          }
        />
        <Route
          path='/Encyclopedia'
          element={
            <EncyclopediaPage
            />
          }
        />
        <Route
          path='/NameCharacters'
          element={
            <NameCharacters
            />
          }
        />
        <Route
          path='YouDied'
          element={
            <YouDied
            />
          }
        />
        <Route
          path='Victory'
          element={
            <VictoryScreen
            />
          }
        />
      </Routes>
      <VolButton />

      {
        isSnowOn && <SnowAnimation precip_type={precipType} />
      }
      <SnowOnOff />

    </>

  );
};



export default App;
