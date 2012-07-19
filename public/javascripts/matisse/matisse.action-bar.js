define(["matisse", "matisse.util"], function (matisse, util) {
  "use strict";
  var actionBar = {
    initalize: function () {
      var selfObj = this;

      //Attach events for the Actions			
      var bottomEle = $(".bottom");
      bottomEle.click(function (e) {
        selfObj.handleAction.call(selfObj, e);
      });

      $(this.popoverElements).popover({
        "placement": "left"
      });
      $(".user-image").popover({
        "placement": "bottom",
        content: function () {
          return "<h1> Hello User, User Data is comming soon! </h1>";
        },
        "trigger": "manual"
      });

      //Attaching the Events for small user pic
      $("#userProfilePic").click(function (e) {
        selfObj.showUserInfoSection();
        return false;
      });
    },
    handleAction: function (e) {
      var ele = $(e.target).closest(".menu-holder");
      if (ele) {
        switch (ele.data().action) {
        case "save":
          this.saveHandler();
          break;
        case "edit":
          break;
        case "discuss":
          this.discussHandler();
          break;
        case "report":
          break;
        case "help":
          break;
        case "view":
          break;
        case "share":
          break;
        }
      }
    },
    discussHandler: function () {
      //TODO Refactor with Bootstrap Dialog		
      $('#chatdialog').dialog({
        width: 250
      });
      var dialog_width = $("#chatdialog").dialog("option", "width");
      var win_width = $(window).width();
      var menu_width = $('div.bottom').width();
      $('#chatdialog').dialog({
        position: [win_width - dialog_width - menu_width - 6, 200]
      });

      $('#chatdialog').dialog('open');
      $('#chatdialog').dialog({
        resizable: false
      });
    },
    saveHandler: function () {
      //TODO Refactor with Bootstrap Dialog
      canvas.deactivateAll();
      var data = canvas.toDataURL('png', 0.1);
      popup('popUpDiv', 'closediv', 600, 600);
      $("#result").html('<img src=' + data + ' />');
    },
    showUserInfoSection: function () {
      $(".userInfoSec").fadeIn();
    },
    hideUserInfoSection: function () {
      if ($(".userInfoSec:visible")) {
        $(".userInfoSec").fadeOut();
      }
    },
    stateUpdated: function (obj, state) {
      if (state == "modified") {
        var originalObj = actionBar.getOriginalObj(obj);
        matisse.undoStack.push({
          palette: obj.palette,
          name: obj.name,
          action: 'modified',
          path: obj.path,
          args: [{
            uid: obj.uid,
            object: originalObj
          }]
        });
      } else if (state == "created") {
        matisse.undoStack.push({
          palette: matisse.paletteName,
          action: matisse.action,
          args: matisse.shapeArgs
        });
      } else if (state == "deleted") {
        var obj = canvas.getActiveObject();
        if (obj) matisse.undoStack.push({
          palette: obj.palette,
          action: obj.name,
          args: [obj]
        });
        matisse.main.deleteObjects();
      }
      if (matisse.undoStack.length > 0) {
        $('#Undo').removeClass('disabled');
      } else {
        $('#Undo').addClass('disabled');
      }
    },
    handleUndoRedoAction: function (command) {
      var executeCommandStack, restoreCommandStack, executeCommandObj, restoreCommandObj;
      if (command == "undo") {
        executeCommandStack = matisse.undoStack;
        restoreCommandStack = matisse.redoStack;
        executeCommandObj = $('#Undo');
        restoreCommandObj = $('#Redo');
      } else if (command == "redo") {
        executeCommandStack = matisse.redoStack;
        restoreCommandStack = matisse.undoStack;
        executeCommandObj = $('#Redo');
        restoreCommandObj = $('#Undo');
      }
      var obj = executeCommandStack.pop();
      if (typeof (obj) != "undefined") {
        if (obj.action == "modified") {
          canvas.getObjects().forEach(function (item, index) {
            if (item.uid == obj.args[0].uid) {
              var currentObj = actionBar.getCurrentObj(item);
              restoreCommandStack.push({
                action: "modified",
                name: obj.name,
                palette: obj.palette,
                path: obj.path,
                args: [{
                  uid: obj.args[0].uid,
                  object: currentObj
                }]
              });
              matisse.comm.sendDrawMsg({
                action: obj.action,
                name: obj.name,
                palette: obj.palette,
                path: obj.path,
                args: obj.args
              });
              matisse.main.modifyObject(obj.args);
            }
          });
        } else if (obj.action == "zindexchannge") {

        } else {
        /* handle deletion and creation of shapes */
          var created = true;
          canvas.getObjects().forEach(function (item, index) {
            if (item.uid == obj.args[0].uid) {
              created = false;
              restoreCommandStack.push(obj);
              canvas.setActiveObject(item);
              matisse.main.deleteObjects();
            }
          });
          if (created) {
            if (obj.args[0].stateProperties) {
              var currentObj = actionBar.getCurrentObj(obj.args[0]);
              currentObj.uid = obj.args[0].uid;
              currentObj.name = obj.action;
              currentObj.palette = obj.palette;
              currentObj.width = obj.args[0].width;
            } else {
              var currentObj = obj.args[0];
            }
            matisse.comm.sendDrawMsg({
              palette: obj.palette,
              action: obj.action,
              path: obj.path,
              args: [currentObj]
            });
            matisse.palette[obj.palette].shapes[obj.action].toolAction.apply(null, obj.args);
            restoreCommandStack.push({
              palette: obj.palette,
              action: obj.action,
              path: obj.path,
              args: [currentObj]
            });
          }
        }
      restoreCommandObj.removeClass('disabled');
      if (executeCommandStack.length > 0) {
        executeCommandObj.removeClass('disabled');
      } else {
        executeCommandObj.addClass('disabled');
      }

      }
    },
    handleCopyAction: function () {
      $('#propdiv').dialog("close");
      canvas.isSelectMode = false;
      var objectToCopy = canvas.getActiveObject();
      matisse.drawShape = true;
      matisse.action = objectToCopy.name;
      matisse.paletteName = objectToCopy.palette;
      var obj = util.getPropertiesFromObject(matisse.palette[matisse.paletteName].shapes[matisse.action].properties, objectToCopy);
      obj.uid = util.uniqid();
      matisse.shapeArgs = [obj];
      $('div.m-quick-edit').fadeOut('fast', function () {
        canvas.discardActiveObject();
        canvas.renderAll();
      });
      $('div.copy-alert').slideDown(400).delay(2000).fadeOut(1000);
    },
    handleGroupCopyAction: function () {
      canvas.isSelectMode = false;
      matisse.drawShape = true;
      matisse.groupCopyMode = true;
      $('div.m-quick-edit-group').fadeOut('fast', function () {
        canvas.discardActiveObject();
        canvas.renderAll();
      });
      $('div.copy-alert').slideDown(400).delay(2000).fadeOut(1000);
    },
    handlealignLeftAction: function (selected_group, selected_group_obj_array) {
      // Align Left
      $.each(selected_group_obj_array, function (index, value) {
        var xpos = 0 - (selected_group.get("width") / 2) + value.width / 2;
        value.set("left", xpos);
      });
    },
    handlealignRightAction: function (selected_group, selected_group_obj_array) {
      // Align Right
      $.each(selected_group_obj_array, function (index, value) {
        var xpos = 0 + (selected_group.get("width") / 2) - value.width / 2;
        value.set("left", xpos);
      })
    },
    handlealignTopAction: function (selected_group, selected_group_obj_array) {
      // Align Top
      $.each(selected_group_obj_array, function (index, value) {
        var ypos = 0 - (selected_group.get("height") / 2) + value.height / 2;
        value.set("top", ypos);
      })
    },
    handlealignBottomAction: function (selected_group, selected_group_obj_array) {
      // Align Bottom
      $.each(selected_group_obj_array, function (index, value) {
        var ypos = 0 + (selected_group.get("height") / 2) - value.height / 2;
        value.set("top", ypos);
      })
    },
    handlealignCenterAction: function (selected_group, selected_group_obj_array) {
      // Align Center
      $.each(selected_group_obj_array, function (index, value) {
        value.set("top", 0);
        value.set("left", 0);
      })
    },
    handledistributeHorizontallyAction: function (selected_group, selected_group_obj_array) {
      //Distribut Horizontally
      var objRightVal = fabric.util.array.max(selected_group_obj_array, "left");
      var objLeftVal = fabric.util.array.min(selected_group_obj_array, "left");
      var spacing = (objRightVal - objLeftVal) / (selected_group_obj_array.length - 1);
      var spacingToAdd = spacing;
      selected_group_obj_array.sort(function (a, b) {
        return a.left - b.left
      });
      $.each(selected_group_obj_array, function (index, value) {
        if (value.left == objLeftVal || value.left == objRightVal) return;
        var xpos = objLeftVal + spacingToAdd;
        value.set("left", xpos);
        spacingToAdd += spacing;
      });
    },
    handledistributeVerticallyAction: function (selected_group, selected_group_obj_array) {
      //Distribut Vertically
      var objBottomVal = fabric.util.array.max(selected_group_obj_array, "top");
      var objTopVal = fabric.util.array.min(selected_group_obj_array, "top");
      var spacing = (objBottomVal - objTopVal) / (selected_group_obj_array.length - 1);
      var spacingToAdd = spacing;
      selected_group_obj_array.sort(function (a, b) {
        return a.top - b.top
      });
      $.each(selected_group_obj_array, function (index, value) {
        if (value.top == objBottomVal || value.top == objTopVal) return;
        var ypos = objTopVal + spacingToAdd;
        value.set("top", ypos);
        spacingToAdd += spacing;
      });
    },
    handleExportJsonAction: function () {
      var exportedJSON = JSON.stringify(canvas);
      popup('popUpDiv', 'closediv', 350, 150);
      $("#result").html("Please provide this exported canvas json while reporting the issue<br/><textarea class='json-export'>" + exportedJSON + "</textarea>");
    },
    handleImportJsonAction: function () {
      console.log("handle import called");
    },

    getOriginalObj: function (obj) {
      var originalObj = {};
      var j;
      for (j = 0; j < obj.stateProperties.length; j++) {
        originalObj[obj.stateProperties[j]] = obj.originalState[obj.stateProperties[j]];
      }
      originalObj["paths"] = obj["paths"];
      return originalObj;
    },
    getCurrentObj: function (obj) {
      var currentObj = {};
      var j;
      for (j = 0; j < obj.stateProperties.length; j++) {
        currentObj[obj.stateProperties[j]] = obj[obj.stateProperties[j]];
      }
      currentObj["paths"] = obj["paths"];
      return currentObj;
    }
  };
  return actionBar;
});