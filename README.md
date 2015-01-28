2048AI
======

Design AI for "2048" game to reach as high score as possible.

Algorithm

Use minimax search with alpha-beta pruning. Idea is inspired by Matt Overlan, with GitHub ID ov3y. Seperate the move operation into the player's move (as the maximizing player's turn in the algorithm), and the computer's generating a tile (as the minimizing player's turn). For each state of the grid, consider a few heuristics to evaluate how good the current state is. Now the algorithm has all the essential parameters to generate a possible optimal move. Then play the game with the move generated then run the algorithm again, so on and so forth until game over.

Observation

To design the AI using minimax search, we have to balance the heuristic design and the depth we use in the search algorithm. If we have large enough memory and space, we can search as deep as possible, and generate a good move even with a very simple heuristic. On the other hand, if we have pretty good prior knowledge, we can design the heuristics reasonably combined with many normalized factors, and search with a very shallow depth. However, in my opinion, the best AI, or an intelligent AI, should not use much prior knowledge but consider only the basic rules of the game and be able to play, even create some ideas that human beings cannot come up with. Hence there are two directions we can focus on, and we should consider the tradeoff.
