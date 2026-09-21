// Script para limpiar IndexedDB y recargar la página
(function() {
    const dbName = 'soliwel_ndt';
    
    // Eliminar la base de datos
    const deleteReq = indexedDB.deleteDatabase(dbName);
    
    deleteReq.onsuccess = function() {
        console.log('Base de datos', dbName, 'eliminada correctamente');
        alert('Base de datos eliminada. Recargando...');
        location.reload();
    };
    
    deleteReq.onerror = function() {
        console.error('Error al eliminar la base de datos');
        alert('Error al eliminar la base de datos');
    };
    
    deleteReq.onblocked = function() {
        console.warn('La base de datos está bloqueada. Cierra otras pestañas.');
        alert('Base de datos bloqueada. Cierra otras pestañas del navegador y vuelve a intentar.');
    };
})();
