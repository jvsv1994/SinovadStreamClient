INSERT INTO Catalog(Id,Name,Deleted) VALUES (1,'Media Server State',0);
INSERT INTO Catalog(Id,Name,Deleted) VALUES (2,'Media Type',0);
INSERT INTO Catalog(Id,Name,Deleted) VALUES (3,'Video Transmision Type',0);
INSERT INTO Catalog(Id,Name,Deleted) VALUES (4,'Transcoder Preset',0);

INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (1,1,'Started',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (1,2,'Stopped',0);

INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (2,1,'Movie',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (2,2,'Tv Serie',0);

INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (3,1,'Normal',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (3,2,'MPEG-DASH',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (3,3,'HLS',0);

INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,1,'ultrafast',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,2,'superfast',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,3,'veryfast',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,4,'faster',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,5,'fast',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,6,'medium',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,7,'slow',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,8,'slower',0);
INSERT INTO CatalogDetail(CatalogId,Id,Name,Deleted) VALUES (4,9,'veryslow',0);
