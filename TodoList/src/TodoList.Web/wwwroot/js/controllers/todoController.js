(function() {
    'use strict';

    var controllerId = "TodoController";

    angular
        .module('app')
        .controller(controllerId, TodoController);

    TodoController.$inject = ['logger', 'Todo'];

    function TodoController(logger, todo) {
        var getLogFn = logger.getLogFn;
        var logInfo = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        var vm = this;

        vm.todos = [];
        vm.todoText = '';
        vm.canAdd = canAdd;
        vm.add = add;
        vm.canArchive = canArchive;
        vm.archive = archive;
        vm.remaining = remaining;
        vm.changed = changed;

        loadTodos();

        function loadTodos() {
            todo.query().$promise.then(
                function (value) {
                    logInfo('Todos loaded.');
                    vm.todos = value;
                },
                function(error) {
                    logError('Failed to load todos: ' + error);
                }
            );
        }

        function canAdd() {
            return vm.todoText.length !== 0 && vm.todoText.trim();
        }

        function add() {
            if (!canAdd()) {
                return;
            }

            var newTodo = new todo();
            newTodo.text = vm.todoText;
            newTodo.done = false;

            newTodo.$save(newTodo).then(
                function(value) {
                    logInfo('Todo "' + value.text + '" was added.');

                    vm.todos.push(value);
                    vm.todoText = '';
                },
                function(error) {
                    logError('Failed to add todo: ' + error);
                });
        }

        function canArchive() {
            var doneItems = vm.todos.filter(function (item) {
                return item.done;
            });
            return doneItems.length > 0;
        }

        function archive() {
            if (!canArchive()) {
                return;
            }

            var oldTodos = vm.todos;
            vm.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (todo.done) {
                    todo.$remove({ id: todo.id }).then(
                        function (value) {
                            logInfo('Todo "' + value.text + '" was removed.');
                        },
                        function (error) {
                            logError('Failed to remove todo: ' + error);
                        });;
                } else {
                    vm.todos.push(todo);
                }
            });
        }

        function remaining() {
            var count = 0;
            angular.forEach(vm.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        }

        function changed(todo) {
            todo.$update().then(
                function (value) {
                    logInfo('Todo "' + value.text + '" was updated.');
                },
                function (error) {
                    logError('Failed to update todo: ' + error);
                });;
        }
    }
})();