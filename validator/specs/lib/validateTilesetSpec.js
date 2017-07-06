'use strict';
var Cesium = require('cesium');
var validateTileset = require('../../lib/validateTileset');

var clone = Cesium.clone;

var sampleTileset = {
    asset: {
        version: '0.0'
    },
    geometricError: 240,
    root: {
        boundingVolume: {
            region: [-1.3197209591796106, 0.6988424218, -1.3196390408203893, 0.6989055782, 0, 88]
        },
        geometricError: 70,
        refine: 'ADD',
        children: [
            {
                boundingVolume: {
                    region: [-1.3197209591796106, 0.6988424218, -1.31968, 0.698874, 0, 20]
                },
                geometricError: 50,
                children: [
                    {
                        boundingVolume: {
                            region: [-1.3197209591796106, 0.6988424218, -1.31968, 0.698874, 0, 10]
                        },
                        geometricError: 0
                    }
                ]
            },
            {
                boundingVolume: {
                    region: [-1.31968, 0.6988424218, -1.3196390408203893, 0.698874, 0, 20]
                },
                geometricError: 0
            }
        ]
    }
};

describe('validateTileset', function() {
    it('succeeds for valid tileset', function(done) {
        expect(validateTileset(sampleTileset)
            .then(function(message) {
                expect(message).toBeUndefined();
            }), done).toResolve();
    });

    it('returns error message when the top-level geometricError is missing', function(done) {
        var tileset = clone(sampleTileset, true);
        delete tileset.geometricError;
        expect(validateTileset(tileset)
            .then(function(message) {
                expect(message).toBe('Tileset must declare its geometricError as a top-level property.');
            }), done).toResolve();
    });

    it('returns error message when refine property of root tile has incorrect value', function(done) {
        var tileset = clone(sampleTileset, true);
        tileset.root.refine = 'NEW';
        expect(validateTileset(tileset)
            .then(function(message) {
                expect(message).toBe('Refine property in root tileset must have either ADD or REPLACE as its value');
            }), done).toResolve();
    });
});
