(function() {

    // Settings
    var settings = {
        fps: 60, // Must be bigger than 1
        sqSize: 15,
        src: '/static/mp3/Marilyn-Manson-Rock-is-Dead.mp3',
        //src: '/static/mp3/Rammstein-Du-hast.mp3',
        //src: '/static/mp3/Rage-Against-The-Machine-Wake-Up.mp3',
        width: window.innerWidth,
        height: window.innerHeight
    };
    var chr = 'abcdefghijklmnopqrstuvwxyzABCDEFQRSXYZ0123456789!"#$%&\'()*+,-./:;<=>?[\\]^_{|}~-\u00AD';

    // Set canvas size
    var cnvs = document.getElementById('the-matrix');
    var mtrx = cnvs.getContext('2d');
    cnvs.setAttribute('width', settings.width);
    cnvs.setAttribute('height', settings.height);

    // WEB Audio API
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var analyser, audioBuffer, source;
    var isPlaying = false;

    // Visualization
    var interval;

    // Reload page on window resize
    window.addEventListener('resize', function() {
        window.location.reload();
    });

    // Start pre-loading audio
    showMessageDownloading();
    loadAudio(function() {

        cnvs.addEventListener('click', function() {
            isPlaying ? stop() : start();
        });

        showMessageClickToPlay();
    });

    //
    // Request, decode and buffer audio data
    //
    function loadAudio(cb) {

        var request = new XMLHttpRequest();
        request.open('GET', settings.src, true);
        request.responseType = 'arraybuffer';

        // Decode async
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                audioBuffer = buffer;
                cb();
            });
        };

        request.send();
    }

    //
    // Start audio & animation
    //
    function start() {
        startAudio();
        startAnimation();
    }

    //
    // Stop audio & animation
    //
    function stop() {
        stopAudio();
        stopAnimation();
    }

    //
    // Play
    //
    function startAudio() {

        source = context.createBufferSource();
        source.buffer = audioBuffer;

        analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.minDecibels = -120;
        analyser.maxDecibels = -40;
        analyser.smoothingTimeConstant = 1 / settings.fps;

        // Pipe sound data through the analyser to destination speakers
        source.connect(analyser);
        analyser.connect(context.destination);

        source.start(0);
        isPlaying = true;
    }

    //
    // Stop
    //
    function stopAudio() {
        try {
            source.stop();
        } catch(e) {}
        isPlaying = false;
    }

    //
    // Start animation fps loop, calling tick() for every frame
    //
    function startAnimation() {
        interval = setInterval(tick, 1000 / settings.fps);
    }

    //
    // Stop animation and clear canvas
    //
    function stopAnimation() {
        clearInterval(interval);
        showMessageClickToPlay();
    }

    //
    // Frame ticks
    //
    function tick() {
        clearCanvas();
        drawFrame();
    }

    //
    // Draw a single frame
    //
    function drawFrame() {
        drawBars(getAnalyserData());
    }

    //
    // Lossy compress analyser frequency data
    //
    function getAnalyserData() {

        // Get sound frequency data
        var analyserFrequencies = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(analyserFrequencies); // populates analyserFrequencies[]

        // Determine bar count & dimensions
        var squaresHorizontal = Math.floor(cnvs.width / settings.sqSize);

        // Prepare 2d array
        var data = Array
            .apply(null, new Array(squaresHorizontal))
            .map(function() {
                return { total: 0, count: 0 };
            });

        // Populate data array with processed frequency data
        var count = analyser.frequencyBinCount;
        for (var i = 0; i < count; i++) {
            var key = Math.floor((i / count) * squaresHorizontal);
            data[key].total += analyserFrequencies[i];
            data[key].count++;
        }

        return data;
    }

    //
    // Draw bars
    //
    function drawBars(data) {

        for (var i = 0; i < data.length; i++) {

            var frequency = getFrequency(data, i);

            drawBarMatrix(frequency, i);
            //drawBarSolid(frequency, i);
        }
    }

    //
    // Draw a matrix bar, consisting of multiple characters
    //
    function drawBarMatrix(frequency, i) {

        // Set text styles
        mtrx.textAlign = 'left';
        mtrx.textBaseline = 'alphabetic';

        var x = i * settings.sqSize;
        var barHeight = (cnvs.height / 3) * frequency;
        var characterCount = Math.floor(barHeight / settings.sqSize);

        for (var ii = 0; ii < characterCount; ii++) {

            // Pick random character
            var char = chr[Math.floor(Math.random() * chr.length)];

            // Determine color
            mtrx.fillStyle = '#0c0';

            var y1 = (cnvs.height / 2) - settings.sqSize * ii;
            mtrx.fillText(char, x, y1);

            var y2 = (cnvs.height / 2) + settings.sqSize * ii;
            mtrx.fillText(char, x, y2);
        }
    }

    //
    // Draw a solid bar
    //
    function drawBarSolid(frequency, i) {

        // Set text style
        mtrx.fillStyle = '#0c0';

        // Draw bar
        var x = i * settings.sqSize;
        var y = (cnvs.height / 2);
        var w = settings.sqSize;
        var h = (cnvs.height / 2) * frequency;
        mtrx.fillRect(x, y, w, h);
        //mtrx.fillRect(x, y, w, -h);
    }

    //
    // Calculate the average frequency in percentage
    //
    function getFrequency(data, i) {
        return (data[i].total / data[i].count) / 256;
    }

    //
    // Clear canvas
    //
    function clearCanvas() {
        mtrx.clearRect(0, 0, cnvs.width, cnvs.height);
    }

    //
    // Set the canvas text style for messages
    //
    function setMessageStyles() {
        clearCanvas();
        mtrx.font = '18px Consolas, monospace';
        mtrx.fillStyle = '#0c0';
        mtrx.textAlign = 'center';
        mtrx.textBaseline = 'middle';
    }

    //
    // Write 'buffering...' text to canvas
    //
    function showMessageDownloading() {
        setMessageStyles();
        mtrx.fillText('Buffering audio...', cnvs.width / 2, cnvs.height / 2);
    }

    //
    // Write 'click to play' text to canvas
    //
    function showMessageClickToPlay() {
        setMessageStyles();
        mtrx.fillText('Click to play!', cnvs.width / 2, cnvs.height / 2);
    }

}());