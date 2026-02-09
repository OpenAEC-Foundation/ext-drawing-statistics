/**
 * Drawing Statistics Extension
 * Displays shape count and drawing statistics via ribbon button and command.
 */
module.exports = {
  onLoad(api) {
    // Add a ribbon button to the Home tab
    api.ui.addRibbonButton({
      tab: 'home',
      group: 'Statistics',
      label: 'Shape Count',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>',
      size: 'large',
      onClick: function () {
        showStatistics(api);
      },
    });

    // Register a terminal command: stats show
    api.commands.register({
      command: 'stats',
      action: 'show',
      description: 'Show drawing statistics (shape counts by type)',
      handler: function () {
        var stats = gatherStatistics(api);
        return {
          success: true,
          message: formatStatisticsText(stats),
        };
      },
    });
  },

  onUnload() {
    // Cleanup is handled automatically by the extension API
  },
};

function gatherStatistics(api) {
  var entities = [];
  try {
    entities = api.entities.list();
  } catch (e) {
    entities = [];
  }

  var counts = {};
  var total = 0;

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    var type = entity.type || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
    total++;
  }

  return { counts: counts, total: total };
}

function formatStatisticsText(stats) {
  if (stats.total === 0) {
    return 'Drawing is empty - no shapes found.';
  }

  var lines = ['Drawing Statistics:', '  Total shapes: ' + stats.total, ''];
  var types = Object.keys(stats.counts).sort();
  for (var i = 0; i < types.length; i++) {
    lines.push('  ' + types[i] + ': ' + stats.counts[types[i]]);
  }
  return lines.join('\n');
}

function showStatistics(api) {
  var stats = gatherStatistics(api);

  if (stats.total === 0) {
    alert('Drawing Statistics\n\nNo shapes in the current drawing.');
    return;
  }

  var message = 'Total shapes: ' + stats.total + '\n\n';
  var types = Object.keys(stats.counts).sort();
  for (var i = 0; i < types.length; i++) {
    message += types[i] + ': ' + stats.counts[types[i]] + '\n';
  }

  alert('Drawing Statistics\n\n' + message);
}
