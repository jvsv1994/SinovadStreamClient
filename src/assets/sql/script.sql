INSERT INTO Catalog(Id,Name) VALUES (1,'Media Server State');
INSERT INTO Catalog(Id,Name) VALUES (2,'Media Type');
INSERT INTO Catalog(Id,Name) VALUES (3,'Video Transmision Type');
INSERT INTO Catalog(Id,Name) VALUES (4,'Transcoder Preset');

INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (1,1,'Started');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (1,2,'Stopped');

INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (2,1,'Movie');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (2,2,'Tv Serie');

INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (3,1,'Normal');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (3,2,'MPEG-DASH');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (3,3,'HLS');

INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,1,'ultrafast');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,2,'superfast');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,3,'veryfast');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,4,'faster');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,5,'fast');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,6,'medium');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,7,'slow');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,8,'slower');
INSERT INTO CatalogDetail(CatalogId,Id,Name) VALUES (4,9,'veryslow');
