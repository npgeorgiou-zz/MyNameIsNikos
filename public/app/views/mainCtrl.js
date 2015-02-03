'use strict';

angular.module('myAppRename', ['angularUtils.directives.dirPagination'])
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.loading = false;
        var mySpinner = Spinner();

        $scope.title = "GlobeJob"

        $scope.predicate = "postDate"
        //pagination vars
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.pageSizeOptions = [10, 20, 50, 100];
        $scope.changePageSize = function changePageSize(size) {
            $scope.pageSize = size;
            console.log($scope.pageSize)
        }

        $scope.clickFieldMemory = [
            {id: 0, value: 'NATURAL_SCIENCES', ticked: false, badgeN: 0},
            {id: 1, value: 'IT', ticked: false, badgeN: 0},
            {id: 2, value: 'BUSINESS/OFFICE', ticked: false, badgeN: 0},
            {id: 3, value: 'LEADERSHIP', ticked: false, badgeN: 0},
            {id: 4, value: 'MED/SOC', ticked: false, badgeN: 0},
            {id: 5, value: 'RES/EDU', ticked: false, badgeN: 0},
            {id: 6, value: 'SERVICE', ticked: false, badgeN: 0},
            {id: 7, value: 'STUDENT', ticked: false, badgeN: 0}
        ];
        $scope.clickAreaMemory = [
            {id: 0, value: 'Copenhagen', ticked: false, badgeN: 0},
            {id: 1, value: 'Zealand', ticked: false, badgeN: 0},
            {id: 2, value: 'South Denmark', ticked: false, badgeN: 0},
            {id: 3, value: 'Middle Jylland', ticked: false, badgeN: 0},
            {id: 4, value: 'North Jylland', ticked: false, badgeN: 0},
            {id: 5, value: 'Scania', ticked: false, badgeN: 0},
            {id: 6, value: 'Greenland & Faroe', ticked: false, badgeN: 0}
        ];
        $scope.unclickAllCheckboxes = false;
        function resetCounters() {
            $scope.clickFieldMemory.forEach(function (c) {
                c.badgeN = 0
            });
            $scope.clickAreaMemory.forEach(function (c) {
                c.badgeN = 0
            });
        }

        $http({
            method: 'GET',
            url: '/query/jobs'
        }).
            success(function (data, status, headers, config) {
                $scope.jobs = data;
                $scope.PERMjobs = data;
                $scope.filterJobsByCheckboxes();
            }).
            error(function (data, status, headers, config) {
                console.log(data)
            });


        $scope.clickField = function (i) {
            //change clicked field value
            if ($scope.clickFieldMemory[i].ticked === false) {
                $scope.clickFieldMemory[i].ticked = true;
            } else {
                $scope.clickFieldMemory[i].ticked = false;
            }
            $scope.filterJobsByCheckboxes();
        }
        $scope.clickArea = function (i) {
        //change clicked area value
            if ($scope.clickAreaMemory[i].ticked === false) {
                $scope.clickAreaMemory[i].ticked = true;
            } else {
                $scope.clickAreaMemory[i].ticked = false;
            }
            $scope.filterJobsByCheckboxes();
        }
        $scope.filterJobsByCheckboxes = function () {
            //start loading effect
            mySpinner.startLoadingEffect();

            //get all clicked fieldboxes. If none is clicked, set all as clicked
            var checkedFieldCheckboxes = $scope.clickFieldMemory.filter(function (c) {
                return c.ticked === true
            });
            if (checkedFieldCheckboxes.length === 0) {
                checkedFieldCheckboxes = $scope.clickFieldMemory;
                //used later to see if REALLY the user has pressed any field checkboxes
                $scope.realNumOfTickedFieldCheckboxes = 0;
            } else {
                $scope.realNumOfTickedFieldCheckboxes = checkedFieldCheckboxes;
            }

            //get all clicked areaboxes. If none is clicked, set all as clicked
            var checkedAreaCheckboxes = $scope.clickAreaMemory.filter(function (c) {
                return c.ticked === true
            });
            if (checkedAreaCheckboxes.length === 0) {
                checkedAreaCheckboxes = $scope.clickAreaMemory;
            }

            //filter by field
            $scope.filteredJobs = $scope.PERMjobs

            $scope.filteredJobs = $scope.filteredJobs.filter(function (j) {
                var jobHasField = false
                checkedFieldCheckboxes.forEach(function (c) {
                    for (var i = 0; i < j.field.length; i++) {
                        if (j.field[i] === c.value) {
                            jobHasField = true
                            break;
                        }
                    }
                });
                return jobHasField
            });

            //filter by area
            $scope.filteredJobs = $scope.filteredJobs.filter(function (j) {
                var jobHasArea = false
                checkedAreaCheckboxes.forEach(function (c) {
                    if (j.area === c.value) {
                        jobHasArea = true
                    }
                });
                return jobHasArea
            });

            //wait 1 sec and continue set jobs
            setTimeout(function () {
                resetCounters()
                $scope.jobs = $scope.filteredJobs;
                //from the jobs that remain after the filters, count categories
                $scope.jobs.forEach(function (j) {
                    for (var i = 0; i < j.field.length; i++) {
                        switch (j.field[i]) {
                            case "NATURAL_SCIENCES":
                                $scope.clickFieldMemory[0].badgeN++
                                break;
                            case "IT":
                                $scope.clickFieldMemory[1].badgeN++
                                break;
                            case "BUSINESS/OFFICE":
                                $scope.clickFieldMemory[2].badgeN++
                                break;
                            case "LEADERSHIP":
                                $scope.clickFieldMemory[3].badgeN++
                                break;
                            case "MED/SOC":
                                $scope.clickFieldMemory[4].badgeN++
                                break;
                            case "RES/EDU":
                                $scope.clickFieldMemory[5].badgeN++
                                break;
                            case "SERVICE":
                                $scope.clickFieldMemory[6].badgeN++
                                break;
                            case "STUDENT":
                                $scope.clickFieldMemory[7].badgeN++
                                break;
                        }
                    }
                });


                //from the jobs that remain after the filters, count areas
                $scope.jobs.forEach(function (j) {
                    switch (j.area) {
                        case "Copenhagen":
                            $scope.clickAreaMemory[0].badgeN++
                            break;
                        case "Zealand":
                            $scope.clickAreaMemory[1].badgeN++
                            break;
                        case "South Denmark":
                            $scope.clickAreaMemory[2].badgeN++
                            break;
                        case "Middle Jylland":
                            $scope.clickAreaMemory[3].badgeN++
                            break;
                        case "North Jylland":
                            $scope.clickAreaMemory[4].badgeN++
                            break;
                        case "Scania":
                            $scope.clickAreaMemory[5].badgeN++
                            break;
                        case "Greenland & Faroe":
                            $scope.clickAreaMemory[6].badgeN++
                            break;
                    }

                });
                //jobs can have lots of categories. hide counter for categories whose checkbox isnt clicked, except if noone is clicked
                //which means that the user searches only by area, so present all
                if ($scope.realNumOfTickedFieldCheckboxes === 0) {
                } else {
                    $scope.clickFieldMemory.forEach(function (c) {
                        if (c.ticked === false) {
                            c.badgeN = 0
                        }
                    });
                }
                //stop loading effect
                mySpinner.stopLoadingEffect();
                $scope.$digest()
            }, 500);

        };
        function Spinner() {
            var container = document.getElementById("jobs_container");
            var SpinnersInRow = 0;

            var startLoadingEffect = function () {
                if ($scope.loading === true) {
                    SpinnersInRow++;
                } else {
                    container.style.opacity = "0.5";
                    $scope.loading = true;
                }
            };

            var stopLoadingEffect = function () {
                if (SpinnersInRow > 0) {
                    SpinnersInRow--;
                } else {
                    container.style.opacity = "1";
                    $scope.loading = false;
                }
            };

            return {
                startLoadingEffect: startLoadingEffect,
                stopLoadingEffect: stopLoadingEffect
            }
        }

        $scope.blue = "blue"
    }]);
