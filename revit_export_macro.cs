/*
 * Revit Macro: ExportPointCloudToCSV
 * ---------------------------------
 * This macro allows you to export points from a PointCloudInstance in Revit to a CSV file.
 * 
 * Instructions:
 * 1. Open Revit and go to the 'Manage' tab.
 * 2. Click 'Macro Manager'.
 * 3. Create a new Module (C#) and then a new Macro named 'ExportSelectedPointCloud'.
 * 4. Paste this code into the editor.
 */

using System;
using System.IO;
using System.Collections.Generic;
using System.Windows.Forms;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB.PointClouds;

namespace ExportUtils
{
    public class PointCloudExporter
    {
        public void ExportSelectedPointCloud(UIDocument uidoc)
        {
            Document doc = uidoc.Document;
            ICollection<ElementId> selectedIds = uidoc.Selection.GetElementIds();

            if (selectedIds.Count == 0)
            {
                TaskDialog.Show("Error", "Por favor seleccione una Nube de Puntos primero.");
                return;
            }

            foreach (ElementId id in selectedIds)
            {
                Element el = doc.GetElement(id);
                if (el is PointCloudInstance)
                {
                    PointCloudInstance pcInstance = el as PointCloudInstance;
                    
                    SaveFileDialog saveFileDialog = new SaveFileDialog();
                    saveFileDialog.Filter = "CSV files (*.csv)|*.csv";
                    if (saveFileDialog.ShowDialog() == DialogResult.OK)
                    {
                        ExportToCsv(pcInstance, saveFileDialog.FileName);
                    }
                }
            }
        }

        private void ExportToCsv(PointCloudInstance pcInstance, string filePath)
        {
            // Max 1 million points per Revit API limit
            int maxPoints = 1000000;
            PointCloudFilter filter = PointCloudFilterFactory.CreateAllPointsFilter();
            
            // Get points with average distance 0 (highest density)
            var points = pcInstance.GetPoints(filter, 0, maxPoints);
            
            using (StreamWriter sw = new StreamWriter(filePath))
            {
                sw.WriteLine("X,Y,Z");
                foreach (CloudPoint p in points)
                {
                    // Convert to model coordinates if needed using pcInstance.GetTransform()
                    sw.WriteLine(string.Format("{0},{1},{2}", p.ViewPoint.X, p.ViewPoint.Y, p.ViewPoint.Z));
                }
            }
            TaskDialog.Show("Exito", "Exportacion completada: " + points.Count + " puntos.");
        }
    }
}
