(function() {

    // Settings
    var fps = 8;
    var loopLength = 15;
    var chr = 'abcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()*+,-./:;<=>?[\\]^_{|}~-\u00AD';

    // Cache DOM queries
    var cnvs = document.getElementById('the-matrix');
    var mtrx = cnvs.getContext('2d');

    // Frame loop timings
    var code = generateAnimation();
    var time  = 1000 * loopLength;
    var start = Date.now();

    // Start animation
    setInterval(tick, 1000 / fps);

    //
    // Generate animation
    //
    function generateAnimation() {

        var w = 33; // cnvs.width;
        var h = 33; // cnvs.height;
        var animLength = h * 10;

        var code = [];
        for (var x = 0; x < w; x++) {

            var line = [];
            var paintLine = true;

            var randomRange = Math.random() < .05 ? 75 : 20;

            while (line.length < animLength) {

                var lineLength  = Math.floor(Math.random() * randomRange);

                for (var i = 0; i < lineLength; i++) {

                    if (paintLine) {
                        line.push({
                            char: chr[Math.floor(Math.random() * chr.length)],
                            opacity: (i / lineLength)
                        });
                    } else {
                        line.push(false);
                    }
                }

                paintLine = !paintLine;
            }

            line = line.slice(0, animLength);
            code.push(line);
        }

        return code;
    }

    //
    // Frame ticks
    //
    function tick() {

        // Frame timing
        var now = Date.now();
        if (now >= (start + time)) {
            start = Date.now();
        }
        var frame = (now - start) / time;

        clearCanvas();
        drawMatrix(frame);
    }

    //
    // Clears the canvas
    //
    function clearCanvas() {

        // Clear canvas
        mtrx.clearRect(0, 0, cnvs.width, cnvs.height);

        // Paint it black
        mtrx.fillStyle = 'black';
        mtrx.fillRect(0, 0, 500, 500);

        // Set text styles
        //mtrx.fillStyle = '#0c0';
        mtrx.font = '18px Matrix';
    }

    //
    // Called every frame
    //
    function drawMatrix(frame) {

        var sqSize = 15;
        var animLength = code[0].length;
        var offset = Math.round((animLength - 33) * frame);

        for (var x = 0; x < 33; x++) {

            for (var y = 0; y < 33; y++) {

                var char = code[x][animLength - 33 - offset + y];
                if (char) {
                    mtrx.fillStyle = 'rgba(0, 204, 0, ' + char.opacity + ')'; // rgb(0,204,0) = #0c0
                    mtrx.fillText(char.char, x * sqSize + 4, y * sqSize + 16);
                }
            }
        }
    }

}());