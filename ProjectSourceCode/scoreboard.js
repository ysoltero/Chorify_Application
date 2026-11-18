app.get('/scoreboard', (req, res) => {
  // Sample data so you can see the page working right away
  const residents = [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 300 },
    { name: "Charlie", points: 185 },
    { name: "Diana", points: 250 }
  ];

  // Sort from highest points to lowest and add rank numbers
  residents.sort((a, b) => b.points - a.points);
  residents.forEach((person, index) => {
    person.rank = index + 1;
  });

  // Render scoreboard.hbs and pass in the sorted list
  // (Change 'pages/scoreboard' to 'scoreboard' if your .hbs files aren't inside a pages/ subfolder)
  res.render('pages/scoreboard', { residents });
});