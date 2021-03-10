import React from 'react';

export default class Uitleg extends React.Component {
    render() {
        return (
            <div className="expl-container">
                <h1>Uitleg</h1>

                Ik heb eigenlijk 2 verschillende implementaties van mijn algoritme, één in javascript en één in Rust/WebAssembly. De source code van de WebAssembly binary kan worden gevonden in de "lib" folder die met deze opdracht kwam.

                Ik heb ook een versie met Tim gemaakt, die was om te oefenen en was voordat we wisten dat het in je ééntje moest (<a href="https://github.com/jorikvanveen/sudokusolver">GitHub repo</a>). Het is niet echt inlevermateriaal maar misschien is het interessant om te zien hoe mijn algoritme is verbeterd sinds dan.

                <h3>Algoritme</h3>
                <p>Ik heb 3 bekende algoritmen gecombineerd tot één, 2 zijn van <a href="https://learn-sudoku.com/">learn-sudoku.com</a>, namelijk Hidden singles en Open singles. Ik zal hieronder in stappen uitleggen hoe mijn algoritme een sudoku op lost</p>

                <h3>Stap 1 - Mogelijkheden bepalen</h3>
                <p>Mijn algoritme gaat als eerst door alle rows, columns en subgrids om voor elke cell te bepalen welke mogelijkheden er in elke cell kan en slaat ze allemaal op in het Cell object</p>

                <h3>Stap 2 - Mogelijkheden wegstrepen.</h3>
                <p>Als 2e stap gaat mijn algoritme elke cell langs om te kijken of er mogelijkheden weggestreept kunnen worden. Dat doet het door nog een keer stap 1 te herhalen met nieuwe data van waarden die zijn ingevuld door hidden singles. Elke keer als er een mogelijkheid weggestreept wordt, checkt mijn remove_candidate functie of er een geldige waarde ingevoerd kan worden. Deze stap wordt herhaald tot dat hij vast loopt.</p>

                <h3>Stap 3 - Aangepast backtracken</h3>
                <p>Als de het algoritme vast loopt bij stap 2 vul ik de rest van de waarden in met het backtracking algoritme. Ik zal proberen kort backtracken samen te vatten, op Wikipedia staat een betere uitleg. <br /><br/>
                
                Backtracken is een algoritme waarbij je 1-9 checkt op een cell, en afhankelijk van of je een geldige waarde kunt vinden ga je achter uit (en vul je 0 in) of ga je weer voor uit.

                <br/><br/>

                Mijn versie van backtracken gebruikt alleen de mogelijkheden die bij de vorige stappen bepaald zijn. Dat betekent dat het soms wel 2 tot 4 keer zo snel is dan door alleen te backtracken. Ook helpt het goed met sudokus die zijn gemaakt om backtracken tegen te gaan.

                </p>

                <h1>Technologieën</h1>

                <p>Deze PO heeft me geïnspireerd om heel veel nieuws te leren over algoritmen, sudokus en nieuwe programmeertalen en technologieën. </p>

                <p>Ik begon met deze opdracht in javascript te doen. Toen besefte ik dat het heel irritant was om geen documentatie te hebben in mijn editor dus ben ik geswitcht naar typescript. In typescript had ik een redelijk algoritme geschreven maar ik wist dat het beter kon. Door bijvoorbeeld C++ te leren, ik ben altijd wel geïnteresseerd geweest in talen die redelijk dicht op de hardware runnen. Alleen had ik me hiervoor nooit over de drempel kunnen halen om het ook echt te gaan leren.</p>
                    
                <p> Ik had C++ een beetje geleerd en had een semi-functionele sudoku oplosser, maar hij was heel traag... trager dan mijn javascript versie. Dat kwam omdat ik weinig ervaring met C++ had en al mijn memory management had verpest waardoor ik een werkend, maar sloom algoritme kreeg. Ik had een paar andere dingen gedaan met C++ zoals een desktop applicatie schrijven, maar ik vond het ecosysteem van C++ maar bagger en kon geen goede plek vinden om het te leren. </p>
                    
                <p>Dus ben ik naar Rust geswitcht. Rust is een taal die gemaakt is door Mozilla, de bedoeling van Rust is om C++ te vervangen in Firefox. Rust garandeert memory safety en heeft richtlijnen die door de compiler worden afgedwongen. Ik besloot om een sudoku oplosser in Rust te schrijven en het ik had een veel betere ervaring dan C++. Alle libraries die ik wilde kon ik gewoon met een commando binnenhalen. Dat is een heel verschil met C++ waarbij ik soms de libraries zelf moest compilen, in mijn project zetten en uren met een CMakeLists.txt bestand kloten voordat het eindelijk werkte.</p>

                <p>Ik besefte me dat ik mijn rust versie niet echt kon inleveren voor deze PO, omdat er een prio was waarbij ik een HTML en CSS frontend moest hebben. Dus ik besloot om WebAssembly te gebruiken, een redelijk nieuw bytecode formaat dat heel snel in je browser kan runnen. ik heb <b>meer dan 6 uur</b> met verschillende javascript en rust libraries gevochten om eindelijk tot een werkende koppeling tussen React en mijn Rust library te krijgen.</p>
            </div>
        )
    }
}