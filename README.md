# A P5.js Vista
## This webpage demonstrates the ability to make randomly generated images and animations in P5.js

This site was broken down into two different effects: A randomly generated mountainous background, and a similarly random tree in the foreground, which drops leaves that fall to the ground.

The mountainous background involved creating a image and altering it pixel by pixel. In layers (starting from the farthest away), mountain heights were calculated using a Perlin Noise function included in P5. Coloring all pixels below those heights results in an opaque layer of color. The color choice is important, and I carefully chose the gradient to give the illusion of depth. It is crucial for execution time to create a separate image at the beginning, instead of drawing the mountains every frame to the main canvas. Each frame must be drawn fresh, as the falling leaves need to change position and cannot leave trails.

The more difficult task was to create a randomly generated tree. Let's start with the leaves:

The leaves were fairly simple moving circles. They started "locked" to the tree, but had an initial velocity set randomly within a range. When unlocked, the leaves follow the initial velocity, while also experiencing slight acceleration. Soon, their speed is capped so they don't fly to fast. When they reach a certain y-position, the floor in this case, they no longer moved and are locked again. Similarly to above, the images for the leaves were calculated once, so that circles didn't need to be repeatedly calculated.

The tree was built on a (likely inefficiently programmed) tree data structure, where each branch could have one or two children. Each branch had a random chance of splitting into two, and the relative angles to their parent were random within a range. When a grow() function was called, each branch would attempt to split until it was successful, so there are always 2^n endpoints at a time. The positions of each branch were maintained, so it was simple to generate a leaf at each terminal branch. Similarly to all the other images, the tree was drawn only once and copied to the canvas at each frame. I had attempted (successfully) to animate the tree with the wind, but the performance and framerate took too big of a hit to justify.

P5.js is a powerful library that focuses on drawing to the screen, and does very little in terms of DOM manipulation. The library is vast and, while setting it up is easy (just include p5.js in your HTML document), learning it can be tough. I recommend searching for The Coding Train on YouTube; He has tons of tutorials on both processing (java-based) and p5.js.
