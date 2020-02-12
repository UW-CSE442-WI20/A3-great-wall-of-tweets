*rationale is located at the bottom of README*


# A3 Starter template

The starter code for creating interactive visualization prototypes.

## Getting Started

This repo is set up to use the [Parcel](https://parceljs.org/) bundler. If you don't
like the way we've set things up, feel free to change it however you like!

The only restriction is that __your final HTML/CSS/JS output must be stored in the "docs" folder__ so that
GitHub knows how to serve it as a static site.

### Install

#### Required software

You must have Node.js installed. I prefer to install it using [nvm](https://github.com/nvm-sh/nvm)
because it doesn't require sudo and makes upgrades easier, but you can also just get it directly from
https://nodejs.org/en/.

#### Install dependecies

Once you've got `node`, run the command `npm install` in this project folder
and it will install all of the project-specific dependencies (if you're curious open up `package.json` to see where these are listed).

npm is the _node package manager_.

### Running the local dev server

To run the project locally, run `npm start` and it will be available at http://localhost:1234/.

### Building the final output

Run `npm run build` and all of your assets will be compiled and placed into the `docs/` folder. Note
that this command will overwrite the existing docs folder.

Once pushed to GitHub, the output should be available at UW-CSE442-WI20.github.io/your-repo-name/


## Other notes

### Using 3rd party libraries

You are more than welcome to use open source packages such as D3.js, just make sure to cite these.

To add a new one run `npm install --save <library-name>`, e.g. `npm install --save d3`. This will
add the library locally so it is available for use in your JS files. It will also add `d3` to the
list of dependencies in `package.json`.

_Note that if you install a library your teammates will need to install it too. Once the dep is added
to `package.json` simply running `npm install` in this directory will download the new dependency._


## Rationale

Our initial decision to build an interactive visualization around Trump’s tweets was to develop a keyword-based scatter plot such that users can explore different tweets and their trend based on keywords. During the exploratory stage, we saw the data included metadata such as likes and retweets, and thus decided to draw a scatter plot where the y axis is the sum of retweet and likes (the two main measures we observed) log transformed (to reduce spread of outliers) against time of tweet as the x axis. Hence we developed a visual encoding presenting popularity and time using position. The tweet’s time of post was recorded down to the second, making it work well as a measure with relatively rare collisions, such that it can also be used as id when needed. Moving forward with the scatter plot, we considered different interaction techniques. We found zooming to be essential as the large size of the plot containing all data was bound to require a zoom-in feature for the user to focus on areas of interest, while panning complements zooming in providing freedom of interaction. Additionally, based on Matt’s suggestion the zooming is only applied w.r.t the x-axis (DateTime), as to maintain expressivity regarding the popularity metric. Meanwhile, we noticed that representing each tweet with a point in a scatter plot provides clarity in observing change in popularity of Trump’s tweets over time, but the user could not see the content of individual tweets. To resolve this issue a tool tip was implemented to show the tweet on demand.

There was more than one way to go about keyword-based exploration, and we had two main candidates to choose from. The first one was that the user can click on a data point to get an updated view, where the plot would be highlighted with a connected map based on tweets that match in keyword used, such that only the data points of interest are presented on demand, similar to the connected map demo using vega lite in lecture. Another candidate was to create a query-based filter system such that users can flexibly search samples based on keyword e.g. only include tweets that have “clinton”. Eventually, We decided to focus on the filter interaction as it provided much more flexible exploration, and there was potential ambiguity we had to handle for a click-based system (given a lot of points form large hard-to-click clusters). To do that, we created a secondary data file that maps words in all the tweets to a unique date object (day and time). In this map we excluded several words like articles, adverbs, etc., using a stop words list. When a user searches, we use our word mapping data set to selectively display tweets with the associated date.

The first two meetings were used to brainstorm visual encoding choices and an overview of aesthetics of the final deliverable, which was finalized mid-development. Our development process split into major sub-components required to build the final product - Exploratory Data Analysis, Search System, and the Frontend. Members assigned to the specific field would perform the task as planned during the meeting until the next one, and whenever available a member could either take a break or complete their task to help with another. For instance, while two of us developed code for scatter plot the other two handled EDA and data cleaning, and then one would move on to the search system while the other kept handling data and so on. Once the frontend group had a functioning scatter plot, they moved on to developing interactive features. Near the end of the development process the group worked in a more flexible way, where a handful of bugs and issues were found and fixed across the entire project. In the final group sessions we made small changes to the layout and style as refinements to its presentation. We believe that the project overall took about 30~35 hours, with the frontend development and refinement for aesthetics taking the most time, given we had to discuss and analyze the aesthetics for both the visual encoding design and their presentation.

Works used:

[Link to Donald Trump's Tweets Data](https://www.kaggle.com/kingburrito666/better-donald-trump-tweets)

[Link to Stop Words List](https://gist.github.com/sebleier/554280#gistcomment-2892081)

[CNN Image of Donald Trump. CNN 5 Jan. 2020](https://cdn.cnn.com/cnnnext/dam/assets/190323113700-0322-trump-twitter-update-exlarge-169.jpg)