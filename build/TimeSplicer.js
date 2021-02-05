(function () {
    'use strict';

    var KeyFrame = /** @class */ (function () {
        function KeyFrame(property, index) {
            this.property = property;
            this.index = index;
            this.time = property.keyTime(index);
            this.value = property.keyValue(index);
            try {
                this.inInterpolationType = property.keyInInterpolationType(index);
                this.outInterpolationType = property.keyOutInterpolationType(index);
            }
            catch (e) { }
            try {
                this.inSpatialTangent = property.keyInSpatialTangent(index);
                this.outSpatialTangent = property.keyOutSpatialTangent(index);
                this.spatialContinuous = property.keySpatialContinuous(index);
                this.spatialAutoBezier = property.keySpatialAutoBezier(index);
            }
            catch (e) { }
            try {
                this.inTemporalEase = property.keyInTemporalEase(index);
                this.outTemporalEase = property.keyOutTemporalEase(index);
                this.temporalContinuous = property.keyTemporalContinuous(index);
                this.temporalAutoBezier = property.keyTemporalAutoBezier(index);
            }
            catch (e) { }
            try {
                this.roving = property.keyRoving(index);
            }
            catch (e) { }
            this.selected = property.keySelected(index);
        }
        KeyFrame.prototype.set = function () {
            try {
                this.index = this.property.addKey(this.time);
            }
            catch (e) {
                alert("Probably you've tried to delete a time remap's keyframe which switched time remapping off?\nPlease undo.", "Operation failed.");
                throw e;
            }
            this.property.setValueAtKey(this.index, this.value);
            if (this.inSpatialTangent) {
                this.property.setSpatialTangentsAtKey(this.index, this.inSpatialTangent, this.outSpatialTangent);
                this.property.setSpatialContinuousAtKey(this.index, this.spatialContinuous);
                this.property.setSpatialAutoBezierAtKey(this.index, this.spatialAutoBezier);
            }
            if (this.inTemporalEase) {
                this.property.setTemporalEaseAtKey(this.index, this.inTemporalEase, this.outTemporalEase);
                this.property.setTemporalContinuousAtKey(this.index, this.temporalContinuous);
                this.property.setTemporalAutoBezierAtKey(this.index, this.temporalAutoBezier);
            }
            if (this.inInterpolationType) {
                this.property.setInterpolationTypeAtKey(this.index, this.inInterpolationType, this.outInterpolationType);
            }
            if (this.roving) {
                this.property.setRovingAtKey(this.index, this.roving);
            }
            this.property.setSelectedAtKey(this.index, this.selected);
        };
        KeyFrame.prototype.remove = function () {
            this.property.removeKey(this.index);
        };
        return KeyFrame;
    }());

    function log() {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        $.writeln(rest.join(" "));
    }

    function reportError(e, msg) {
        if (msg === void 0) { msg = ""; }
        var finalMessage = e && msg ? msg + "\n" + e.message : e || msg;
        log(finalMessage);
        alert(finalMessage, "Error");
    }

    function addTimeToProperty(property, addAt, timeToAdd) {
        try {
            var dummyKeyFrameTime = -666; // Prevents time remap from switching off
            var dummyKeyIndex = property.name === "Time Remap" && property.numKeys
                ? property.addKey(dummyKeyFrameTime)
                : -1;
            var keyFrames = [];
            for (var i = 1; i <= property.numKeys; i++) {
                if (i === dummyKeyIndex)
                    continue;
                var keyFrame = new KeyFrame(property, i);
                keyFrames.push(keyFrame);
            }
            for (var i = keyFrames.length - 1; i >= 0; i--) {
                keyFrames[i].remove();
            }
            for (var _i = 0, keyFrames_1 = keyFrames; _i < keyFrames_1.length; _i++) {
                var keyFrame = keyFrames_1[_i];
                if (timeToAdd >= 0) {
                    if (keyFrame.time >= addAt) {
                        keyFrame.time += timeToAdd;
                    }
                    keyFrame.set();
                }
                else {
                    var deleteFrom = addAt;
                    var timeToDelete = Math.abs(timeToAdd);
                    var isToBeKept = keyFrame.time < deleteFrom;
                    var isToBeMoved = keyFrame.time >= deleteFrom + timeToDelete;
                    if (isToBeKept || isToBeMoved) {
                        if (isToBeMoved) {
                            keyFrame.time -= timeToDelete;
                        }
                        keyFrame.set();
                    }
                }
            }
            if (dummyKeyIndex >= 0) {
                property.removeKey(property.nearestKeyIndex(dummyKeyFrameTime));
            }
        }
        catch (e) {
            reportError(e, "[qnys4j] Property could not be moved: " + property.name);
        }
    }

    function addTimeToProperties(parent, addAt, timeToAdd) {
        for (var i = 1; i <= parent.numProperties; i++) {
            var property = parent.property(i);
            if (property instanceof Property) {
                addTimeToProperty(property, addAt, timeToAdd);
            }
            else if (property instanceof PropertyGroup) {
                addTimeToProperties(property, addAt, timeToAdd);
            }
        }
    }

    function addTimeToLayer(layer, addAt, timeToAdd) {
        if (layer.inPoint >= addAt) {
            // Not layer.startTime because we usually have parts selected for a reason
            layer.startTime += timeToAdd;
        }
        else {
            addTimeToProperties(layer, addAt, timeToAdd);
            if (timeToAdd >= 0) {
                // Must copy values because outPoint can get corrupted when inPoint is set
                var inPoint = layer.inPoint;
                var outPoint = layer.outPoint;
                if (inPoint >= addAt) {
                    inPoint += timeToAdd;
                }
                if (outPoint >= addAt) {
                    outPoint += timeToAdd;
                }
                layer.inPoint = inPoint;
                layer.outPoint = outPoint;
            }
            else {
                var deleteFrom = addAt;
                var timeToDelete = Math.abs(timeToAdd);
                if (layer.inPoint >= deleteFrom) {
                    layer.inPoint = deleteFrom;
                }
                if (layer.outPoint >= deleteFrom + timeToDelete) {
                    layer.outPoint = layer.outPoint - timeToDelete;
                }
                else if (layer.outPoint >= deleteFrom) {
                    layer.outPoint = deleteFrom;
                }
            }
        }
    }

    function getActiveComp() {
        var _a;
        var activeComp = (_a = app === null || app === void 0 ? void 0 : app.project) === null || _a === void 0 ? void 0 : _a.activeItem;
        if (!(activeComp instanceof CompItem)) {
            reportError(null, "[qnys9l] The selected item is not a composition.");
            throw new Error("NoActiveComp");
        }
        return activeComp;
    }

    function getSelectedLayers(comp) {
        var _a;
        var selectedLayers = (_a = comp === null || comp === void 0 ? void 0 : comp.selectedLayers) !== null && _a !== void 0 ? _a : [];
        if (selectedLayers.length == 0) {
            selectedLayers = [];
            for (var i = 1; i <= comp.numLayers; i++) {
                selectedLayers.push(comp.layer(i));
            }
        }
        return selectedLayers;
    }

    function addTime(timeToAdd) {
        var activeComp = getActiveComp();
        app.beginUndoGroup("Composition Time " + (timeToAdd >= 0 ? "Added" : "Deleted"));
        try {
            var selectedLayers = getSelectedLayers(activeComp);
            var addAt = activeComp.time;
            for (var _i = 0, selectedLayers_1 = selectedLayers; _i < selectedLayers_1.length; _i++) {
                var aLayer = selectedLayers_1[_i];
                addTimeToLayer(aLayer, addAt, timeToAdd);
            }
            if (selectedLayers.length == activeComp.numLayers) {
                activeComp.duration += timeToAdd;
            }
        }
        catch (e) {
            reportError(e, "[qnys8f] There was an error. Please undo.");
        }
        app.endUndoGroup();
    }

    function breakCompApart() {
        var activeComp = getActiveComp();
        var selectedLayers = getSelectedLayers(activeComp);
        selectedLayers.sort(function (a, b) { return a.index - b.index; });
        app.beginUndoGroup("Composition Broken Apart");
        try {
            var aLayer;
            var aLayerComp;
            var aSubLayer;
            var aSubLayerMoved;
            for (var i = 0; i < selectedLayers.length; i++) {
                aLayer = selectedLayers[i];
                if (!(aLayer instanceof AVLayer))
                    continue;
                aLayerComp = aLayer.source;
                if (!(aLayerComp instanceof CompItem))
                    continue;
                for (var j = aLayerComp.numLayers; j > 0; j--) {
                    aSubLayer = aLayerComp.layer(j);
                    aSubLayer.copyToComp(activeComp);
                    aSubLayerMoved = activeComp.layer(aLayer.index - 1);
                    aSubLayerMoved.moveAfter(aLayer);
                    aSubLayerMoved.startTime += aLayer.startTime;
                }
                aLayer.remove();
            }
        }
        catch (e) {
            reportError(e, "[qnysqo] There was an error. Please undo.");
        }
        app.endUndoGroup();
    }

    var timeField = null;
    function setTimeField(v) {
        timeField = v;
    }
    function getTimeField() {
        return timeField;
    }

    function getFps() {
        var _a, _b, _c;
        return (_c = (_b = (_a = app === null || app === void 0 ? void 0 : app.project) === null || _a === void 0 ? void 0 : _a.activeItem) === null || _b === void 0 ? void 0 : _b.frameRate) !== null && _c !== void 0 ? _c : 25;
    }

    function getTime() {
        var isDuration = true;
        return currentFormatToTime(getTimeField().text, getFps(), isDuration);
    }

    function extendComp() {
        getActiveComp().duration += getTime();
    }

    function fitComp() {
        var activeComp = getActiveComp();
        if (!activeComp.numLayers)
            return;
        app.beginUndoGroup("Composition Fitted");
        try {
            var aLayer;
            var minInPoint = Infinity;
            var maxOutPoint = -Infinity;
            for (var i = 1; i <= activeComp.numLayers; i++) {
                aLayer = activeComp.layer(i);
                minInPoint = Math.min(aLayer.inPoint, minInPoint);
            }
            for (i = 1; i <= activeComp.numLayers; i++) {
                aLayer = activeComp.layer(i);
                aLayer.startTime -= minInPoint;
                maxOutPoint = Math.max(aLayer.outPoint, maxOutPoint);
            }
            activeComp.duration = maxOutPoint;
        }
        catch (e) {
            reportError(e, "[qnyspz] There was an error. Please undo.");
        }
        app.endUndoGroup();
    }

    function groupIntoComp() {
        var activeComp = getActiveComp();
        var selectedLayers = getSelectedLayers(activeComp);
        selectedLayers.sort(function (a, b) { return a.index - b.index; });
        app.beginUndoGroup("Layers Grouped into Composition");
        try {
            var aLayer;
            var minInPoint = Infinity;
            var maxOutPoint = -Infinity;
            var minIndexLayer = selectedLayers[0];
            for (var i = 0; i < selectedLayers.length; i++) {
                aLayer = selectedLayers[i];
                minInPoint = Math.min(aLayer.inPoint, minInPoint);
                maxOutPoint = Math.max(aLayer.outPoint, maxOutPoint);
                minIndexLayer =
                    minIndexLayer.index < aLayer.index ? minIndexLayer : aLayer;
            }
            var groupComp = app.project.items.addComp("Group", activeComp.width, activeComp.height, activeComp.pixelAspect, maxOutPoint - minInPoint, activeComp.frameRate);
            var groupCompLayer = activeComp.layers.add(groupComp);
            groupCompLayer.moveBefore(minIndexLayer);
            groupCompLayer.startTime = minInPoint;
            for (i = selectedLayers.length - 1; i >= 0; i--) {
                aLayer = selectedLayers[i];
                aLayer.startTime -= minInPoint;
                aLayer.copyToComp(groupComp);
                aLayer.remove();
            }
        }
        catch (e) {
            reportError(e, "[qnyspk] There was an error. Please undo.");
        }
        app.endUndoGroup();
    }

    function onTimeFieldChanged() {
        var fps = getFps();
        var isDuration = true;
        var timeField = getTimeField();
        timeField.text = timeToCurrentFormat(currentFormatToTime(timeField.text, fps, isDuration), fps, isDuration);
    }

    var window = new Window("palette", "Time splicer", undefined, {
    // resizeable: true,
    });
    window.orientation = "row";
    window.margins = 1;
    window.spacing = 1;
    var timeField$1 = window.add("edittext");
    timeField$1.minimumSize = [50, 20];
    timeField$1.onChange = onTimeFieldChanged;
    setTimeField(timeField$1);
    var addTimeButton = window.add("button", undefined, "Add time");
    addTimeButton.onClick = function () {
        addTime(getTime());
    };
    window.defaultElement = addTimeButton;
    var extendCompButton = window.add("button", undefined, "Extend");
    extendCompButton.onClick = extendComp;
    var deleteTimeButton = window.add("button", undefined, "Delete time");
    deleteTimeButton.onClick = function () {
        addTime(-getTime());
    };
    var fitCompButton = window.add("button", undefined, "Fit composition");
    fitCompButton.onClick = fitComp;
    var groupIntoCompButton = window.add("button", undefined, "Group layers");
    groupIntoCompButton.onClick = groupIntoComp;
    var breakCompApartButton = window.add("button", undefined, "Break composition apart");
    breakCompApartButton.onClick = breakCompApart;
    window.show();

}());
