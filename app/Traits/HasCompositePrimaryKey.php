<?php
namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasCompositePrimaryKey
{
    /**
     * Disable auto-incrementing since we have composite key.
     */
    public $incrementing = false;

    /**
     * Override setKeysForSaveQuery to use composite PK.
     */
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }
        foreach ($this->getKeyName() as $keyField) {
            $query->where($keyField, '=', $this->getAttribute($keyField));
        }
        return $query;
    }

    /**
     * Make getKeyName return our composite key array.
     */
    public function getKeyName()
    {
        return $this->primaryKey;
    }
}
