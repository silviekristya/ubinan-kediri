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
    protected function setKeysForSaveQuery(Builder $query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }
        foreach ($keys as $keyName) {
            $query->where($keyName, '=', $this->getAttribute($keyName));
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
