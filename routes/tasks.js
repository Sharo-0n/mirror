var data = {
  tasks: ['Finish this lab']
};

/*
 * GET tasks page.
 */
exports.view = function(req, res){
  res.render('tasks', data);
};

